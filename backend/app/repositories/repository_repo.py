from typing import List
from sqlalchemy.orm import Session
from app.models.repository import Repository

def get_by_profile_id(db: Session, profile_id: int, skip: int = 0, limit: int = 100) -> List[Repository]:
    """Fetch all repositories for a specific profile ID."""
    return db.query(Repository).filter(Repository.profile_id == profile_id).offset(skip).limit(limit).all()

def get_top_by_profile_id(db: Session, profile_id: int, limit: int = 5) -> List[Repository]:
    """Fetch the top repositories based on stars and forks."""
    return db.query(Repository).filter(Repository.profile_id == profile_id).order_by(
        Repository.stargazers_count.desc(), 
        Repository.forks_count.desc()
    ).limit(limit).all()

def replace_all_for_profile(db: Session, profile_id: int, repos_data: List[dict]) -> None:
    """
    Replaces the local cache of repositories for a user.
    Deletes existing cached repositories and inserts the fresh ones.
    """
    # Clear existing cached repos for this profile
    db.query(Repository).filter(Repository.profile_id == profile_id).delete()
    
    # Insert fresh repos
    db_repos = [Repository(profile_id=profile_id, **repo_data) for repo_data in repos_data]
    db.add_all(db_repos)
    db.commit()
