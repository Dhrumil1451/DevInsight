from pydantic import BaseModel
from typing import List
from datetime import datetime


class SavedProfileResponse(BaseModel):
    id: int
    username: str
    name: str | None = None
    avatar_url: str | None = None
    saved_at: datetime


class SavedProfileListData(BaseModel):
    saved_profiles: List[SavedProfileResponse]


class SavedProfileListResponse(BaseModel):
    success: bool
    message: str
    data: SavedProfileListData