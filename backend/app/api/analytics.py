from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.analytics_service import analytics_service
from app.schemas.analytics_schema import AnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/{username}",response_model=AnalyticsResponse)
def get_analytics(username: str, db: Session = Depends(get_db)):
    """Retrieves the complete structured analytics dashboard for a user."""
    snapshot = analytics_service.get_snapshot(db, username)
    return {
        "success": True,
        "message": "Analytics retrieved successfully",
        "data": snapshot
    }
