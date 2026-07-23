from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def analytics_placeholder():
    return {"message": "Analytics route working"}