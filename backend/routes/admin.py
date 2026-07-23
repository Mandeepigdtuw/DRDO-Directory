from fastapi import APIRouter, Depends, HTTPException
from database import personnel_collection
from models.personnel import PersonnelCreate, PersonnelUpdate
from auth import verify_token
from nlp.embedder import get_text_embedding
from nlp.searcher import refresh_index
from bson import ObjectId

router = APIRouter()

def format_person(person: dict) -> dict:
    person["_id"] = str(person["_id"])
    person.pop("embedding_vector", None)
    person.pop("profile_text", None)
    return person

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


@router.get("/personnel")
def get_all_personnel(token: str = Depends(verify_token)):
    persons = list(personnel_collection.find({}))
    return {"count": len(persons), "personnel": [format_person(p) for p in persons]}

@router.get("/personnel/{employee_id}")
def get_person(employee_id: str, token: str = Depends(verify_token)):
    person = personnel_collection.find_one({"employee_id": employee_id})
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return format_person(person)

@router.post("/personnel")
def add_personnel(data: PersonnelCreate, token: str = Depends(verify_token)):
    existing = personnel_collection.find_one({"employee_id": data.employee_id})
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    person_dict = data.dict()
    profile_text = build_profile_text(person_dict)
    person_dict["profile_text"] = profile_text
    person_dict["embedding_vector"] = get_text_embedding(profile_text)
    personnel_collection.insert_one(person_dict)
    refresh_index()
    return {"message": "Personnel added successfully", "employee_id": data.employee_id}

@router.put("/personnel/{employee_id}")
def update_personnel(employee_id: str, data: PersonnelUpdate, token: str = Depends(verify_token)):
    person = personnel_collection.find_one({"employee_id": employee_id})
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if update_data:
        merged = {**person, **update_data}
        profile_text = build_profile_text(merged)
        update_data["profile_text"] = profile_text
        update_data["embedding_vector"] = get_text_embedding(profile_text)
        personnel_collection.update_one(
            {"employee_id": employee_id},
            {"$set": update_data}
        )
        refresh_index()
    return {"message": "Personnel updated successfully", "employee_id": employee_id}

@router.delete("/personnel/{employee_id}")
def delete_personnel(employee_id: str, token: str = Depends(verify_token)):
    person = personnel_collection.find_one({"employee_id": employee_id})
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    personnel_collection.delete_one({"employee_id": employee_id})
    refresh_index()
    return {"message": "Personnel deleted successfully", "employee_id": employee_id}