from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories import repository_repo, profile_repo
from app.services.github_client import github_client

class RepositoryService:
    def get_all(self, db: Session, username: str, skip: int = 0, limit: int = 100):
        profile = profile_repo.get_by_username(db, username)

        if not profile:
            raise HTTPException(status_code=404, detail="User not found")

        repositories = repository_repo.get_by_profile_id(
        db,
        profile.id,
        skip,
        limit
    )

    # If cache is empty, fetch from GitHub
        if not repositories:
            self.fetch_and_cache_repositories(db, profile)

        repositories = repository_repo.get_by_profile_id(
            db,
            profile.id,
            skip,
            limit
        )

        return repositories
        #--------------------This code seems not updating the cache when required. We need to make sure that if the cache is empty, it should fetch the data from the GitHub and save it in the database------------------

    def get_top(self, db: Session, username: str, limit: int = 5):
        profile = profile_repo.get_by_username(db, username)
        if not profile:
            raise HTTPException(status_code=404, detail="User not found")
        return repository_repo.get_top_by_profile_id(db, profile.id, limit)

    def fetch_and_cache_repositories(self, db: Session, profile):
        """
        Fetches all public repos from GitHub via pagination and replaces 
        the local cache in the database.
        """
        raw_repos = github_client.get_user_repositories(profile.username)
        
        mapped_repos = []
        for repo in raw_repos:
            mapped_repos.append({
                "github_repo_id": repo.get("id"),
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "description": repo.get("description"),
                "language": repo.get("language"),
                "stargazers_count": repo.get("stargazers_count", 0),
                "forks_count": repo.get("forks_count", 0),
                "open_issues_count": repo.get("open_issues_count", 0)
            })
            
        repository_repo.replace_all_for_profile(db, profile.id, mapped_repos)

repository_service = RepositoryService()
