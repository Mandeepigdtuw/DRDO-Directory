# backend/nlp/searcher.py
import faiss
import numpy as np
from database import personnel_collection
from nlp.embedder import get_query_embedding

faiss_index = None
employee_id_map = []

def build_faiss_index():
    global faiss_index, employee_id_map

    print("Building FAISS index from MongoDB...")
    all_persons = list(personnel_collection.find(
        {"embedding_vector": {"$exists": True}},
        {"employee_id": 1, "embedding_vector": 1}
    ))

    if not all_persons:
        print("No embeddings found in database.")
        return

    vectors = np.array(
        [p["embedding_vector"] for p in all_persons],
        dtype='float32'
    )

    dimension = vectors.shape[1]
    faiss_index = faiss.IndexFlatIP(dimension)
    faiss.normalize_L2(vectors)
    faiss_index.add(vectors)

    employee_id_map = [p["employee_id"] for p in all_persons]
    print(f"FAISS index built with {faiss_index.ntotal} vectors.")

def semantic_search(query: str, top_k: int = 10) -> list:
    global faiss_index
    if faiss_index is None or faiss_index.ntotal == 0:
        build_faiss_index()

    query_vector = get_query_embedding(query).astype('float32').reshape(1, -1)
    faiss.normalize_L2(query_vector)
    scores, indices = faiss_index.search(query_vector, top_k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx == -1:
            continue
        results.append({
            "employee_id": employee_id_map[idx],
            "score": round(float(score), 4)
        })
    return results

def apply_keyword_boost(results: list, query: str) -> list:
    query_words = query.lower().split()
    boosted = []

    for r in results:
        person = personnel_collection.find_one(
            {"employee_id": r["employee_id"]},
            {"full_name": 1, "designation": 1, "department": 1,
             "lab_acronym": 1, "area_of_expertise": 1}
        )
        if not person:
            boosted.append(r)
            continue

        boost = 0.0
        searchable = " ".join([
            person.get("full_name", ""),
            person.get("designation", ""),
            person.get("department", ""),
            person.get("lab_acronym", ""),
            " ".join(person.get("area_of_expertise", []))
        ]).lower()

        for word in query_words:
            if len(word) > 2 and word in searchable:
                boost += 0.05

        boosted.append({
            "employee_id": r["employee_id"],
            "score": round(min(r["score"] + boost, 1.0), 4)
        })

    boosted.sort(key=lambda x: x["score"], reverse=True)
    return boosted

def refresh_index():
    build_faiss_index()