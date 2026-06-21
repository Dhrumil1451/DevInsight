from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RepositoryResponse(BaseModel):
    id: int
    github_repo_id: int
    name: str
    full_name: str
    description: Optional[str] = None
    language: Optional[str] = None
    stargazers_count: int
    forks_count: int
    open_issues_count: int
    profile_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RepositoryListData(BaseModel):
    repositories: List[RepositoryResponse]

class RepositoryListResponse(BaseModel):
    success: bool
    message: str
    data: RepositoryListData
