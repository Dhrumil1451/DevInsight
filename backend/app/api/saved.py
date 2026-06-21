from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.services.saved_service import saved_service

from app.schemas.saved_schema import SavedProfileListResponse

router = APIRouter(prefix="/saved", tags=["Saved Developers"])

class SaveDeveloperRequest(BaseModel):
    username: str

@router.post("/",response_model=SavedProfileListResponse)
def save_developer(request: SaveDeveloperRequest, db: Session = Depends(get_db)):
    """
    Bookmarks a developer profile.
    """
    saved_service.save_developer(db, request.username)
    return {
        "success": True,
        "message": "Developer saved",
        "data": {}
    }

@router.get("/")
def get_saved_developers(db: Session = Depends(get_db)):
    """
    Retrieves the list of bookmarked developers.
    """
    profiles = saved_service.get_saved(db)
    return {
        "success": True,
        "message": "Saved developers retrieved",
        "data": {
            "saved_profiles": profiles
        }
    }

@router.delete("/{id}")
def remove_saved_developer(id: int, db: Session = Depends(get_db)):
    """
    Removes a developer bookmark.
    """
    saved_service.remove_saved(db, id)
    return {
        "success": True,
        "message": "Saved developer removed",
        "data": {}
    }
