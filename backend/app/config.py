from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    PROJECT_NAME: str = "DevInsight"

    API_V1_STR: str = "/api"

    ENVIRONMENT: str = "development"


    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]


    DATABASE_URL: str = "sqlite:///./devinsight.db"


    GITHUB_TOKEN: str = ""


    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()