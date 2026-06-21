from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.history_service import history_service

router = APIRouter(prefix="/history", tags=["Search History"])

@router.get("/")
def get_history(
    limit: int = Query(10, description="Number of recent search records to retrieve"), 
    db: Session = Depends(get_db)
):
    """
    Retrieves the most recent search history globally.
    """
    history = history_service.get_history(db, limit)
    
    return {
        "success": True,
        "message": "Search history retrieved",
        "data": {
            "history": history
        }
    }
