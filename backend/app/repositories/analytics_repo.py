from typing import Optional
from sqlalchemy.orm import Session
from app.models.analytics_snapshot import AnalyticsSnapshot


def get_by_profile_id(
    db: Session,
    profile_id: int
) -> Optional[AnalyticsSnapshot]:
    """
    Fetch the latest analytics snapshot for a profile.
    """

    return (
        db.query(AnalyticsSnapshot)
        .filter(
            AnalyticsSnapshot.profile_id == profile_id
        )
        .order_by(
            AnalyticsSnapshot.id.desc()
        )
        .first()
    )

def create_or_update(db: Session, profile_id: int, analytics_data: dict) -> AnalyticsSnapshot:
    """Creates a new analytics snapshot or updates the existing one."""
    db_snapshot = get_by_profile_id(db, profile_id)
    
    if db_snapshot:
        # Update existing
        for key, value in analytics_data.items():
            setattr(db_snapshot, key, value)
    else:
        # Create new
        db_snapshot = AnalyticsSnapshot(profile_id=profile_id, **analytics_data)
        db.add(db_snapshot)
        
    db.commit()
    db.refresh(db_snapshot)
    return db_snapshot
