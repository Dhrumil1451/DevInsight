from sqlalchemy.orm import Session
from app.services.profile_service import profile_service
from app.services.analytics_service import analytics_service

class CompareService:
    def compare_developers(self, db: Session, user1: str, user2: str):
        """
        Orchestrates fetching profiles and analytics for two distinct users 
        to serve the frontend comparison views.
        """
        profile1 = profile_service.get_or_fetch_profile(db, user1)
        profile2 = profile_service.get_or_fetch_profile(db, user2)
        
        analytics1 = analytics_service.get_snapshot(db, user1)
        analytics2 = analytics_service.get_snapshot(db, user2)
        
        return {
            "user1": {
                "profile": profile1,
                "analytics": analytics1
            },
            "user2": {
                "profile": profile2,
                "analytics": analytics2
            }
        }

compare_service = CompareService()
