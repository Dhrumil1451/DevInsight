from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.trending_service import trending_service

from app.schemas.trending_schema import TrendingListResponse

router = APIRouter(prefix="/trending", tags=["Trending"])

@router.get("/",response_model=TrendingListResponse)
def get_trending(
    limit: int = Query(10, description="Number of trending developers to retrieve"), 
    db: Session = Depends(get_db)
):
    """
    Retrieves trending developers based on platform search frequency.
    """
    trending = trending_service.get_trending(db, limit)
    
    return {
        "success": True,
        "message": "Trending developers retrieved",
        "data": {
            "trending": trending
        }
    }
