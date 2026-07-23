# backend/routes/search.py
from fastapi import APIRouter, Query, HTTPException
from database import personnel_collection, search_logs_collection
from nlp.searcher import semantic_search, apply_keyword_boost
from datetime import datetime

router = APIRouter()

def format_person(person: dict) -> dict:
    person["_id"] = str(person["_id"])
    person.pop("embedding_vector", None)
    person.pop("profile_text", None)
    return person

@router.get("/")
def search(q: str = Query(..., min_length=1, description="Search query")):
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    raw_results = semantic_search(q, top_k=10)
    boosted_results = apply_keyword_boost(raw_results, q)

    final_results = []
    for r in boosted_results:
        person = personnel_collection.find_one({"employee_id": r["employee_id"]})
        if person:
            formatted = format_person(person)
            formatted["relevance_score"] = r["score"]
            final_results.append(formatted)

    search_logs_collection.insert_one({
        "query_text": q.strip(),
        "timestamp": datetime.utcnow(),
        "results_count": len(final_results),
        "top_result_id": final_results[0]["employee_id"] if final_results else None
    })

    return {
        "query": q,
        "count": len(final_results),
        "results": final_results
    }