from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def search_placeholder():
    return {"message": "Search route working"}