# backend/regenerate_embeddings.py
from database import personnel_collection
from nlp.embedder import get_text_embedding

def build_profile_text(person):
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

persons = list(personnel_collection.find({}))
print(f"Regenerating embeddings for {len(persons)} records...")

for i, person in enumerate(persons):
    profile_text = build_profile_text(person)
    embedding = get_text_embedding(profile_text)
    personnel_collection.update_one(
        {"employee_id": person["employee_id"]},
        {"$set": {
            "embedding_vector": embedding,
            "profile_text": profile_text
        }}
    )
    print(f"[{i+1}/{len(persons)}] Updated: {person['full_name']}")

print("✅ All embeddings regenerated successfully.")