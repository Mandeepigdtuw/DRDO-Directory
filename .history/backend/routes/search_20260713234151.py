# backend/routes/search.py
from fastapi import APIRouter, Query, HTTPException
from database import personnel_collection, search_logs_collection
from nlp.searcher import semantic_search, apply_keyword_boost
from datetime import datetime
from spellchecker import SpellChecker
import re

router = APIRouter()
spell = SpellChecker()

# ─── ACRONYM DICTIONARY ──────────────────────────────────────────────────────
ACRONYM_MAP = {
    "EW":      "Electronic Warfare",
    "UAV":     "Unmanned Aerial Vehicle",
    "AUV":     "Autonomous Underwater Vehicle",
    "NLP":     "Natural Language Processing",
    "AI":      "Artificial Intelligence",
    "NBC":     "Nuclear Biological Chemical",
    "RCS":     "Radar Cross Section",
    "AESA":    "Active Electronically Scanned Array",
    "DRFM":    "Digital Radio Frequency Memory",
    "SAR":     "Synthetic Aperture Radar",
    "DEW":     "Directed Energy Weapons",
    "MALE":    "Medium Altitude Long Endurance",
    "HGV":     "Hypersonic Glide Vehicle",
    "GNC":     "Guidance Navigation Control",
    "IR":      "Infrared",
    "RF":      "Radio Frequency",
    "VLSI":    "Very Large Scale Integration",
    "FPGA":    "Field Programmable Gate Array",
    "CFD":     "Computational Fluid Dynamics",
    "FEM":     "Finite Element Method",
    "ML":      "Machine Learning",
    "CV":      "Computer Vision",
    "DL":      "Deep Learning",
    "RL":      "Reinforcement Learning",
    "UUV":     "Unmanned Underwater Vehicle",
    "USV":     "Unmanned Surface Vehicle",
    "UGV":     "Unmanned Ground Vehicle",
    "SIGINT":  "Signal Intelligence",
    "ELINT":   "Electronic Intelligence",
    "C4I":     "Command Control Communication Computers Intelligence",
    "EO":      "Electro Optical",
    "IFF":     "Identification Friend or Foe",
    "ECM":     "Electronic Countermeasures",
    "ECCM":    "Electronic Counter Countermeasures",
    "GPS":     "Global Positioning System",
    "INS":     "Inertial Navigation System",
    "IMU":     "Inertial Measurement Unit",
    "PET":     "Positron Emission Tomography",
    "NDT":     "Non Destructive Testing",
}

# ─── LAB NAMES (should never be expanded or spell-corrected) ─────────────────
KNOWN_LAB_ACRONYMS = {
    "LRDE", "DRDO", "DRDL", "CAIR", "NSTL", "NPOL", "DIPAS",
    "DFRL", "DMRL", "ARDE", "HEMRL", "TBRL", "DLRL", "SAC",
    "RCI", "ADE", "NAL", "INMAS", "DIBER", "DMSRDE", "DRDE",
    "SAG", "DESIDOC", "NRL", "GTRE", "IRDE", "SSPL", "LASTEC",
    "CHESS", "DEAL", "MTRDC", "DEBEL", "CFEES", "PXE", "ASL",
}

# ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────

def format_person(person: dict) -> dict:
    person["_id"] = str(person["_id"])
    person.pop("embedding_vector", None)
    person.pop("profile_text", None)
    return person

def correct_spelling(query: str) -> str:
    """
    Correct spelling mistakes in query.
    Skips: ALL CAPS words (acronyms), known lab names,
           proper nouns (Title Case), numbers, and single characters.
    """
    words = query.split()
    corrected = []

    for word in words:
        clean_word = re.sub(r'[^a-zA-Z]', '', word).upper()

        # Skip known lab acronyms
        if clean_word in KNOWN_LAB_ACRONYMS:
            corrected.append(word)
            continue

        # Skip all-caps words (other acronyms)
        if word.isupper() and len(word) >= 2:
            corrected.append(word)
            continue

        # Skip Title Case words (likely proper names)
        if word[0].isupper() and len(word) > 1:
            corrected.append(word)
            continue

        # Skip numbers
        if word.isdigit():
            corrected.append(word)
            continue

        # Skip very short words
        if len(word) <= 2:
            corrected.append(word)
            continue

        # Attempt spell correction
        correction = spell.correction(word.lower())
        if correction and correction != word.lower():
            print(f"  Spell: '{word}' → '{correction}'")
            corrected.append(correction)
        else:
            corrected.append(word)

    return ' '.join(corrected)

def expand_acronyms(query: str) -> str:
    """
    Replace known technical acronyms with full forms.
    Skips lab acronyms since those should stay as-is for exact matching.
    """
    words = query.split()
    expanded = []

    for word in words:
        clean_word = re.sub(r'[^a-zA-Z]', '', word).upper()

        # Don't expand lab acronyms
        if clean_word in KNOWN_LAB_ACRONYMS:
            expanded.append(word)
            continue

        # Expand if in acronym map
        if clean_word in ACRONYM_MAP:
            print(f"  Acronym: '{word}' → '{ACRONYM_MAP[clean_word]}'")
            expanded.append(ACRONYM_MAP[clean_word])
        else:
            expanded.append(word)

    return ' '.join(expanded)

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
        r'\b(with less than|with more than|with at least|with over)\b',
        r'\b(years of experience|years experience|yrs experience)\b',
    ]
    cleaned = query.lower()
    for pattern in filler_patterns:
        cleaned = re.sub(pattern, ' ', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned if cleaned else query

def is_exact_query(query: str) -> bool:
    """
    Detect if query should use exact MongoDB match instead of semantic search.
    Triggers for: single words, acronyms, employee IDs, short proper phrases.
    """
    q = query.strip()
    words = q.split()

    # Single word → exact match
    if len(words) == 1:
        return True

    # Two words with no common filler words → likely name or acronym pair
    if len(words) == 2:
        common_words = {'in', 'at', 'of', 'the', 'and', 'or', 'for', 'with', 'from'}
        if not any(w.lower() in common_words for w in words):
            return True

    # Employee ID pattern
    if re.match(r'^DRDO-\d+$', q, re.IGNORECASE):
        return True

    # Any all-caps word present (acronym or lab name)
    if any(w.isupper() and len(w) >= 2 for w in words):
        return True

    return False

def exact_match_search(query: str) -> list:
    """
    Direct MongoDB regex search across all key fields.
    Used for exact/partial keyword queries.
    """
    q = query.strip()
    regex = {"$regex": q, "$options": "i"}

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

def score_exact_results(results: list, query: str) -> list:
    """
    Score and rank exact match results based on which field matched
    and how closely it matched.
    """
    q_lower = query.lower()
    scored = []

    for person in results:
        score = 0.5  # base score

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

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored

# ─── ROUTES ──────────────────────────────────────────────────────────────────

@router.get("/")
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(default=10, ge=1, le=80)
):
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    print(f"\n🔍 Original query: '{q}'")
    final_results = []

    if is_exact_query(q):
        # ── EXACT MATCH PATH ──────────────────────────────────────────────
        print("  Mode: Exact Match")
        exact_results = exact_match_search(q)

        if exact_results:
            scored = score_exact_results(exact_results, q)
            for person, score in scored[:top_k]:
                formatted = format_person(person)
                formatted["relevance_score"] = round(score, 4)
                final_results.append(formatted)

        # Fallback to semantic if exact match found nothing
        if not final_results:
            print("  Exact match empty → falling back to semantic")
            spell_corrected = correct_spelling(q)
            acronym_expanded = expand_acronyms(spell_corrected)
            cleaned_q = clean_query(acronym_expanded)
            print(f"  Pipeline: '{q}' → '{spell_corrected}' → '{acronym_expanded}' → '{cleaned_q}'")
            raw_results = semantic_search(cleaned_q, top_k=top_k)
            boosted_results = apply_keyword_boost(raw_results, cleaned_q)
            for r in boosted_results:
                person = personnel_collection.find_one({"employee_id": r["employee_id"]})
                if person:
                    formatted = format_person(person)
                    formatted["relevance_score"] = r["score"]
                    final_results.append(formatted)

    else:
        # ── SEMANTIC SEARCH PATH ──────────────────────────────────────────
        print("  Mode: Semantic Search")
        spell_corrected = correct_spelling(q)
        acronym_expanded = expand_acronyms(spell_corrected)
        cleaned_q = clean_query(acronym_expanded)
        print(f"  Pipeline: '{q}' → '{spell_corrected}' → '{acronym_expanded}' → '{cleaned_q}'")

        raw_results = semantic_search(cleaned_q, top_k=top_k)
        boosted_results = apply_keyword_boost(raw_results, cleaned_q)

        for r in boosted_results:
            person = personnel_collection.find_one({"employee_id": r["employee_id"]})
            if person:
                formatted = format_person(person)
                formatted["relevance_score"] = r["score"]
                final_results.append(formatted)

    # ── LOG SEARCH ────────────────────────────────────────────────────────
    search_logs_collection.insert_one({
        "query_text": q.strip(),
        "timestamp": datetime.utcnow(),
        "results_count": len(final_results),
        "top_result_id": final_results[0]["employee_id"] if final_results else None
    })

    print(f"  Returned {len(final_results)} results\n")
    return {"query": q, "count": len(final_results), "results": final_results}


@router.get("/all")
def get_all_for_sort():
    """Returns all personnel records for client-side sorting."""
    persons = list(personnel_collection.find({}))
    return {
        "results": [format_person(p) for p in persons]
    }