from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories import analytics_repo, profile_repo

class AnalyticsService:
    def get_snapshot(self, db: Session, username: str):
        profile = profile_repo.get_by_username(db, username)
        if not profile:
            raise HTTPException(status_code=404, detail="User not found")
            
        # Ensure a snapshot is saved for historical tracking if it doesn't exist
        snapshot = analytics_repo.get_by_profile_id(db, profile.id)
        if not snapshot:
            return self.generate_and_save_analytics(db, profile)
            
        # PER REQUIREMENT: Do not reconstruct developer_score manually. 
        # Return the full analytics_data generated dynamically by engine.
        from app.analytics.engine import generate_analytics_for_profile
        return generate_analytics_for_profile(db, profile)

    def generate_and_save_analytics(self, db: Session, profile):
        from app.analytics.engine import generate_analytics_for_profile
        
        # Generate the full structured data
        analytics_data = generate_analytics_for_profile(db, profile)

        # Extract values for database snapshot caching
        snapshot_data = {
            "developer_score": analytics_data["developer_score"]["score"],
            "language_diversity": analytics_data["developer_score"]["breakdown"]["language_diversity"],
            "growth_score": analytics_data["developer_score"]["breakdown"]["growth"],
            "contribution_score": analytics_data["developer_score"]["breakdown"]["contribution"],
            "repo_health_average": analytics_data["developer_score"]["breakdown"]["repo_health"],
            "total_languages": analytics_data["language_analysis"]["total_languages"],
            "most_used_language": analytics_data["language_analysis"]["most_used_language"],
            "language_distribution": analytics_data["language_analysis"]["distribution"],
            "generated_insights": analytics_data["insights"]
        }

        # Save to database
        analytics_repo.create_or_update(
            db,
            profile.id,
            snapshot_data
        )

        # Return the exact pure dictionary instead of the database model
        return analytics_data

analytics_service = AnalyticsService()
