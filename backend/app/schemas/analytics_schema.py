from pydantic import BaseModel
from typing import List

class DeveloperScoreBreakdown(BaseModel):
    growth: float
    contribution: float
    language_diversity: float
    repo_health: float

class DeveloperScoreResponse(BaseModel):
    score: float
    breakdown: DeveloperScoreBreakdown

class LanguageDistributionItem(BaseModel):
    language: str
    count: int

class LanguageAnalysisResponse(BaseModel):
    most_used_language: str
    total_languages: int
    distribution: List[LanguageDistributionItem]

class GrowthAnalysisResponse(BaseModel):
    growth_score: float

class RepoHealthResponse(BaseModel):
    average_health: float

class AnalyticsDataResponse(BaseModel):
    developer_score: DeveloperScoreResponse
    language_analysis: LanguageAnalysisResponse
    growth_analysis: GrowthAnalysisResponse
    repo_health: RepoHealthResponse
    insights: str

class AnalyticsResponse(BaseModel):
    success: bool
    message: str
    data: AnalyticsDataResponse
