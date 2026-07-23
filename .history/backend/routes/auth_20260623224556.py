# backend/routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import admins_collection
from auth import verify_password, create_access_token, get_password_hash
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

# This runs once to create the admin account if it doesn't exist yet
def init_admin():
    existing = admins_collection.find_one({"username": os.getenv("ADMIN_USERNAME")})
    if not existing:
        admins_collection.insert_one({
            "username": os.getenv("ADMIN_USERNAME"),
            "password": get_password_hash(os.getenv("ADMIN_PASSWORD"))
        })

@router.post("/login")
def login(request: LoginRequest):
    admin = admins_collection.find_one({"username": request.username})
    if not admin or not verify_password(request.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({"sub": request.username})
    return {"access_token": token, "token_type": "bearer"}