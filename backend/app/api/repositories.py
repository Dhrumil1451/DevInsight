from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.repository_service import repository_service
from app.schemas.repository_schema import RepositoryListResponse
router = APIRouter(prefix="/repositories", tags=["Repositories"])



@router.get("/{username}",response_model=RepositoryListResponse)
def get_repositories(
    username: str, 
    page: int = Query(1, ge=1), 
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieves a paginated list of all public repositories for a user."""
    skip = (page - 1) * limit
    repos = repository_service.get_all(db, username, skip, limit)
    return {
        "success": True,
        "message": "Repositories retrieved",
        "data": {"repositories": repos}
    }

@router.get("/{username}/top",response_model=RepositoryListResponse)
def get_top_repositories(
    username: str, 
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Retrieves the top repositories based on stars and forks."""
    repos = repository_service.get_top(db, username, limit)
    return {
        "success": True,
        "message": "Top repositories retrieved",
        "data": {"repositories": repos}
    }
