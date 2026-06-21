from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.profile_service import profile_service
from app.schemas.user_schema import UserResponseWrapper

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{username}", response_model=UserResponseWrapper)
def get_user(username: str, db: Session = Depends(get_db)):
    """Fetches a developer profile. Reaches out to GitHub if not cached locally."""
    profile = profile_service.get_or_fetch_profile(db, username)
    return {
        "success": True,
        "message": "Profile retrieved successfully",
        "data": profile
    }

@router.post("/{username}/refresh")
def refresh_user(username: str, db: Session = Depends(get_db)):
    """Forces a refresh of the profile and recalculates analytics."""
    fresh_profile = profile_service.refresh_profile_and_analytics(db, username)
    return {
        "success": True,
        "message": "Profile refresh initiated",
        "data": {"status": "processing", "username": fresh_profile.username}
    }
