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
    return cleaned if cleaned else query

def exact_match_search(query: str) -> list:
    """
    Search MongoDB directly using exact/partial keyword matching.
    Used when query looks like a specific name, lab, department, 
    employee ID, or project keyword.
    """
    q = query.strip()
    regex = {"$regex": q, "$options": "i"}  # case-insensitive

    results = list(personnel_collection.find({
        "$or": [
            {"full_name": regex},
            {"employee_id": regex},
            {"lab_acronym": regex},
            {"department": regex},
            {"designation": regex},
            {"area_of_expertise": regex},
            {"projects_associated": regex},
        ]
    }))
    return results

def is_exact_query(query: str) -> bool:
    """
    Detect if the query looks like a specific keyword that should
    use exact matching rather than semantic search.
    Triggers when:
    - Query is short (1-2 words)
    - Looks like an acronym (all caps or mixed short caps)
    - Looks like an employee ID
    - Looks like a proper name
    """
    q = query.strip()
    words = q.split()

    # Single word query → exact match
    if len(words) == 1:
        return True

    # Two word query with no common words → likely name or acronym pair
    if len(words) == 2:
        common_words = {'in', 'at', 'of', 'the', 'and', 'or', 'for', 'with', 'from'}
        if not any(w.lower() in common_words for w in words):
            return True

    # Looks like employee ID (e.g. DRDO-1001)
    if re.match(r'^DRDO-\d+$', q, re.IGNORECASE):
        return True

    # All caps word present (likely acronym like LRDE, CAIR, DESIDOC)
    if any(w.isupper() and len(w) >= 2 for w in words):
        return True

    return False

@router.get("/")
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(default=10, ge=1, le=80)
):
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    final_results = []

    if is_exact_query(q):
        # --- EXACT MATCH PATH ---
        # Directly query MongoDB for keyword matches
        exact_results = exact_match_search(q)

        if exact_results:
            # Assign relevance scores based on match quality
            scored = []
            q_lower = q.lower()
            for person in exact_results:
                score = 0.5  # base score for any match

                # Boost score based on which field matched
                if q_lower in person.get("lab_acronym", "").lower():
                    score += 0.5
                if q_lower in person.get("full_name", "").lower():
                    score += 0.5
                if q_lower in person.get("employee_id", "").lower():
                    score += 0.5
                if q_lower in person.get("department", "").lower():
                    score += 0.4
                if any(q_lower in exp.lower() for exp in person.get("area_of_expertise", [])):
                    score += 0.3
                if any(q_lower in proj.lower() for proj in person.get("projects_associated", [])):
                    score += 0.3
                if q_lower in person.get("designation", "").lower():
                    score += 0.2

                scored.append((person, min(score, 1.0)))

            # Sort by score descending
            scored.sort(key=lambda x: x[1], reverse=True)

            for person, score in scored[:top_k]:
                formatted = format_person(person)
                formatted["relevance_score"] = round(score, 4)
                final_results.append(formatted)

        # If exact match found nothing, fall through to semantic search
        if not final_results:
            cleaned_q = clean_query(q)
            raw_results = semantic_search(cleaned_q, top_k=top_k)
            boosted_results = apply_keyword_boost(raw_results, cleaned_q)
            for r in boosted_results:
                person = personnel_collection.find_one({"employee_id": r["employee_id"]})
                if person:
                    formatted = format_person(person)
                    formatted["relevance_score"] = r["score"]
                    final_results.append(formatted)

    else:
        # --- SEMANTIC SEARCH PATH ---
        cleaned_q = clean_query(q)
        raw_results = semantic_search(cleaned_q, top_k=top_k)
        boosted_results = apply_keyword_boost(raw_results, cleaned_q)
        for r in boosted_results:
            person = personnel_collection.find_one({"employee_id": r["employee_id"]})
            if person:
                formatted = format_person(person)
                formatted["relevance_score"] = r["score"]
                final_results.append(formatted)

    # Log search
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