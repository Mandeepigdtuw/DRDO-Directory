from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def admin_placeholder():
    return {"message": "Admin route working"}