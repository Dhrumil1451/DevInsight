from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import profile_repo, search_history_repo
from app.services.github_client import github_client
from datetime import datetime

class ProfileService:
    def get_or_fetch_profile(self, db: Session, username: str):
        """
        Fetches the profile locally. If not found, reaches out to GitHub.
        Always logs the search history.
        """
        # Always log search history
        search_history_repo.create(db=db, username=username)

        profile = profile_repo.get_by_username(db, username)
        if profile:
            return profile

        # If not local, fetch from GitHub
        return self._fetch_and_save(db, username)

    def refresh_profile_and_analytics(self, db: Session, username: str):
        """
        Forces a refresh of the profile from GitHub, caches the repositories, 
        and recalculates the analytics.
        """
        profile = profile_repo.get_by_username(db, username)
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found locally to refresh.")
        
        # Fetch fresh data
        fresh_profile = self._fetch_and_save(db, username)
        
        # Trigger repository caching (avoiding circular import at top level)
        from app.services.repository_service import repository_service
        repository_service.fetch_and_cache_repositories(db, fresh_profile)
        
        # Trigger analytics engine synchronously
        from app.services.analytics_service import analytics_service
        analytics_service.generate_and_save_analytics(db, fresh_profile)
        
        return fresh_profile

    def _fetch_and_save(self, db: Session, username: str):
        raw_data = github_client.get_user_profile(username)
        
        mapped_data = {
            "github_id": raw_data.get("id"),
            "username": raw_data.get("login"),
            "name": raw_data.get("name"),
            "avatar_url": raw_data.get("avatar_url"),
            "bio": raw_data.get("bio"),
            "company": raw_data.get("company"),
            "location": raw_data.get("location"),
            "followers": raw_data.get("followers", 0),
            "following": raw_data.get("following", 0),
            "public_repos": raw_data.get("public_repos", 0),
            "account_created_at": (datetime.fromisoformat(
            raw_data.get("created_at").replace("Z", "+00:00")
        )
        if raw_data.get("created_at")
        else None),
        }
        
        existing = profile_repo.get_by_username(db, username)
        if existing:
            return profile_repo.update(db, existing, mapped_data)
        return profile_repo.create(db, mapped_data)

profile_service = ProfileService()
