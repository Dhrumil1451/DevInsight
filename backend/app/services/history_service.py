from sqlalchemy.orm import Session
from app.repositories import search_history_repo

class HistoryService:
    def get_history(self, db: Session, limit: int = 50):
        """Returns the most recent search history globally."""
        return search_history_repo.get_recent(db, limit)

history_service = HistoryService()
