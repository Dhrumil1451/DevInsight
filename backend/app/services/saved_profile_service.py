from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories import saved_profile_repo, profile_repo

class SavedProfileService:
    def save(self, db: Session, username: str):
        profile = profile_repo.get_by_username(db, username)
        if not profile:
            raise HTTPException(status_code=404, detail="User not found")
            
        existing = saved_profile_repo.get_by_profile_id(db, profile.id)
        if existing:
            return existing
            
        return saved_profile_repo.create(db, profile.id)

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return saved_profile_repo.get_all(db, skip, limit)

    def remove(self, db: Session, saved_id: int):
        success = saved_profile_repo.delete(db, saved_id)
        if not success:
            raise HTTPException(status_code=404, detail="Saved profile not found")

saved_profile_service = SavedProfileService()
