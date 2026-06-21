from sqlalchemy.orm import Session
from app.repositories import search_history_repo

class TrendingService:
    def get_trending(self, db: Session, limit: int = 10):
        """
        Retrieves the top trending developers based on platform search frequency.
        Delegates the grouping and counting logic to the repository layer.
        """
        return search_history_repo.get_trending(db, limit)

# Singleton instance
trending_service = TrendingService()
