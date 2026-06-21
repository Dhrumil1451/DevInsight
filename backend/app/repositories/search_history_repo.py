from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models.search_history import SearchHistory

def create(db: Session, username: str, profile_id: Optional[int] = None) -> SearchHistory:
    """Log a new search event."""
    db_history = SearchHistory(username=username, profile_id=profile_id)
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history

def get_recent(db: Session, limit: int = 10) -> List[SearchHistory]:
    """Get the most recent search events globally."""
    return db.query(SearchHistory).order_by(SearchHistory.searched_at.desc()).limit(limit).all()

def get_trending(db: Session, limit: int = 10) -> List[dict]:
    """
    Aggregate search history to return the most frequently searched usernames.
    """
    results = db.query(
        SearchHistory.username, 
        func.count(SearchHistory.id).label('search_count')
    ).group_by(SearchHistory.username).order_by(desc('search_count')).limit(limit).all()
    
    return [{"username": row.username, "search_count": row.search_count} for row in results]
