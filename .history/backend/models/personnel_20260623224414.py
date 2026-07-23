# backend/models/personnel.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class PersonnelCreate(BaseModel):
    employee_id: str
    full_name: str
    gender: str
    designation: str
    department: str
    lab_acronym: str
    area_of_expertise: List[str]
    projects_associated: List[str]
    phone_office: str
    email: EmailStr
    years_of_experience: int

class PersonnelUpdate(BaseModel):
    full_name: Optional[str] = None
    gender: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    lab_acronym: Optional[str] = None
    area_of_expertise: Optional[List[str]] = None
    projects_associated: Optional[List[str]] = None
    phone_office: Optional[str] = None
    email: Optional[EmailStr] = None
    years_of_experience: Optional[int] = None