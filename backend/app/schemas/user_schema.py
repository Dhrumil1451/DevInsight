from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DeveloperProfileResponse(BaseModel):
    id: int
    github_id: int
    username: str

    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None

    followers: int
    following: int
    public_repos: int

    account_created_at: Optional[datetime] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True



class UserResponseWrapper(BaseModel):
    success: bool
    message: str
    data: DeveloperProfileResponse