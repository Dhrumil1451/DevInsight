from pydantic import BaseModel
from typing import List


class TrendingDeveloperResponse(BaseModel):
    username: str
    search_count: int


class TrendingListData(BaseModel):
    trending: List[TrendingDeveloperResponse]


class TrendingListResponse(BaseModel):
    success: bool
    message: str
    data: TrendingListData