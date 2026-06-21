from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db

# Importing compare_service (previously implemented)
from app.services.compare_service import compare_service

router = APIRouter(prefix="/compare", tags=["Compare"])

@router.get("/")
def compare_developers(
    user1: str = Query(..., description="GitHub username of the first developer"), 
    user2: str = Query(..., description="GitHub username of the second developer"), 
    db: Session = Depends(get_db)
):
    """
    Fetches profiles and analytics snapshots for two developers side-by-side
    for direct comparison.
    """
    # Delegates business logic to the service layer
    comparison = compare_service.compare_developers(db, user1, user2)
    
    return {
        "success": True,
        "message": "Comparison data ready",
        "data": comparison
    }
