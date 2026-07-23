# backend/routes/search.py
from fastapi import APIRouter, Query, HTTPException
from database import personnel_collection, search_logs_collection
from nlp.searcher import semantic_search, apply_keyword_boost
from datetime import datetime
import re

router = APIRouter()

def format_person(person: dict) -> dict:
    person["_id"] = str(person["_id"])
    person.pop("embedding_vector", None)
    person.pop("profile_text", None)
    return person

def clean_query(query: str) -> str:
    """Remove filler phrases that dilute semantic meaning."""
    filler_patterns = [
        r'\b(who is|who are|find me|show me|i want|i need|give me)\b',
        r'\b(currently working on|working on|related to|in the field of)\b',
        r'\b(the project|a project|some project|any project)\b',
        r'\b(scientist|engineer|researcher|expert|specialist|person|people)\b',
        r'\b(please|kindly|can you|could you|tell me about)\b',
        r'\b(who has|who have|having|with experience in|with expertise in)\b',
        r'\b(looking for|search for|find|get me|fetch)\b',
    ]
    cleaned = query.lower()
    for pattern in filler_patterns:
        cleaned = re.sub(pattern, ' ', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    print(f"Query cleaned: '{query}' → '{cleaned}'")
    return cleaned if cleaned else query

def build_profile_text(person: dict) -> str:
    expertise = ', '.join(person.get('area_of_expertise', []))
    projects = ', '.join(person.get('projects_associated', []))
    return (
        f"{person['full_name']} is a {person['designation']} "
        f"in the {person['department']} department at {person['lab_acronym']}. "
        f"Specializes in {expertise}. "
        f"Works on projects: {projects}. "
        f"Research areas include {expertise}. "
        f"Project involvement: {projects}. "
        f"Has {person['years_of_experience']} years of experience "
        f"in {person['department']}."
    )

@router.get("/")
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(default=10, ge=1, le=80)
):
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Clean query before semantic search
    cleaned_q = clean_query(q)

    raw_results = semantic_search(cleaned_q, top_k=top_k)
    boosted_results = apply_keyword_boost(raw_results, cleaned_q)

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

    return {"query": q, "count": len(final_results), "results": final_results}


@router.get("/all")
def get_all_for_sort():
    """Returns all personnel records for client-side sorting."""
    persons = list(personnel_collection.find({}))
    return {
        "results": [format_person(p) for p in persons]
    }