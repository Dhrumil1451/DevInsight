from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session, joinedload
from app.models.saved_profile import SavedProfile

def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
    """Retrieve all bookmarked profiles with enriched developer data."""
    # Perform a joinedload to fetch the related DeveloperProfile efficiently
    records = db.query(SavedProfile).options(
        joinedload(SavedProfile.profile)
    ).offset(skip).limit(limit).all()
    
    return [
        {
            "id": record.id,
            "username": record.profile.username if record.profile else None,
            "name": record.profile.name if record.profile else None,
            "avatar_url": record.profile.avatar_url if record.profile else None,
            "saved_at": record.saved_at.isoformat() if record.saved_at else None
        }
        for record in records
    ]

def get_by_profile_id(db: Session, profile_id: int) -> Optional[SavedProfile]:
    """Check if a specific profile is already saved."""
    return db.query(SavedProfile).filter(SavedProfile.profile_id == profile_id).first()

def create(db: Session, profile_id: int, custom_notes: Optional[str] = None) -> SavedProfile:
    """Bookmark a developer profile."""
    db_saved = SavedProfile(profile_id=profile_id, custom_notes=custom_notes)
    db.add(db_saved)
    db.commit()
    db.refresh(db_saved)
    return db_saved

def delete(db: Session, saved_id: int) -> bool:
    """Remove a developer profile from bookmarks."""
    db_saved = db.query(SavedProfile).filter(SavedProfile.id == saved_id).first()
    if db_saved:
        db.delete(db_saved)
        db.commit()
        return True
    return False
