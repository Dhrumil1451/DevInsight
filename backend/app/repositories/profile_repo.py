from typing import Optional
from sqlalchemy.orm import Session
from app.models.developer_profile import DeveloperProfile

def get_by_username(db: Session, username: str) -> Optional[DeveloperProfile]:
    """Fetch a profile by GitHub username."""
    return db.query(DeveloperProfile).filter(DeveloperProfile.username == username).first()

def create(db: Session, profile_data: dict) -> DeveloperProfile:
    """Create a new developer profile in the database."""
    db_profile = DeveloperProfile(**profile_data)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def update(db: Session, db_profile: DeveloperProfile, update_data: dict) -> DeveloperProfile:
    """Update an existing developer profile."""
    for key, value in update_data.items():
        setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile
