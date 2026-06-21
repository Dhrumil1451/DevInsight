from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import profile_repo, saved_profile_repo

class SavedService:
    def save_developer(self, db: Session, username: str):
        """
        Validates that a developer profile exists before bookmarking it.
        Creates a new saved record using the repository.
        """
        profile = profile_repo.get_by_username(db, username)
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Developer profile not found"
            )
            
        # Optional safeguard: check if it's already saved
        existing_saved = saved_profile_repo.get_by_profile_id(db, profile.id)
        if existing_saved:
            return existing_saved
            
        saved_record = saved_profile_repo.create(db, profile.id)
        return saved_record

    def get_saved(self, db: Session):
        """
        Retrieves all saved developer profiles.
        """
        # Pass a generous limit to the repo if it implements pagination
        return saved_profile_repo.get_all(db, skip=0, limit=1000)

    def remove_saved(self, db: Session, saved_id: int):
        """
        Removes a bookmarked developer by ID.
        """
        success = saved_profile_repo.delete(db, saved_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Saved developer not found"
            )
        return True

# Singleton instance
saved_service = SavedService()
