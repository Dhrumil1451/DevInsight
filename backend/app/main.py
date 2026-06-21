from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import engine, Base

from app.core.exception_handler import (
    validation_exception_handler,
    database_exception_handler,
    general_exception_handler,
    http_exception_handler
)


# =========================
# MODEL REGISTRATION
# =========================

from app.models.developer_profile import DeveloperProfile
from app.models.repository import Repository
from app.models.search_history import SearchHistory
from app.models.analytics_snapshot import AnalyticsSnapshot
from app.models.saved_profile import SavedProfile
from app.models.report import Report



# =========================
# ROUTERS
# =========================

from app.api import health
from app.api import users
from app.api import analytics
from app.api import repositories
from app.api import compare
from app.api import history
from app.api import saved
from app.api import trending
from app.api import reports



# =========================
# DATABASE INITIALIZATION
# =========================

Base.metadata.create_all(bind=engine)



# =========================
# SWAGGER TAGS
# =========================

tags_metadata = [

    {
        "name": "Health",
        "description": "API health monitoring"
    },

    {
        "name": "Users",
        "description": "GitHub developer profile operations"
    },

    {
        "name": "Repositories",
        "description": "Developer repository information"
    },

    {
        "name": "Analytics",
        "description": "Developer intelligence and scoring"
    },

    {
        "name": "Compare",
        "description": "Compare two developers"
    },

    {
        "name": "Trending",
        "description": "Trending developers based on searches"
    },

    {
        "name": "Saved",
        "description": "Manage saved developers"
    },

    {
        "name": "Reports",
        "description": "Generate developer PDF reports"
    }

]



def get_application() -> FastAPI:


    application = FastAPI(

        title="DevInsight API",

        description="""
        DevInsight is a GitHub developer analytics platform.

        Features:

        - GitHub profile analysis
        - Repository analytics
        - Developer scoring
        - Language diversity analysis
        - Developer comparison
        - Trending developers
        - Saved profiles
        - PDF analytics reports

        """,

        version="1.0.0",

        openapi_tags=tags_metadata,

        contact={
            "name": "DevInsight Developer"
        },

        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )



    # =========================
    # ERROR HANDLERS
    # =========================


    application.add_exception_handler(
        RequestValidationError,
        validation_exception_handler
    )


    application.add_exception_handler(
        SQLAlchemyError,
        database_exception_handler
    )


    application.add_exception_handler(
        HTTPException,
        http_exception_handler
    )


    application.add_exception_handler(
        Exception,
        general_exception_handler
    )



    # =========================
    # CORS
    # =========================


    if settings.CORS_ORIGINS:

        application.add_middleware(

            CORSMiddleware,

            allow_origins=settings.CORS_ORIGINS,

            allow_credentials=True,

            allow_methods=["*"],

            allow_headers=["*"],

        )



    # =========================
    # ROUTERS
    # =========================


    application.include_router(
        health.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        users.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        analytics.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        repositories.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        compare.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        history.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        saved.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        trending.router,
        prefix=settings.API_V1_STR
    )


    application.include_router(
        reports.router,
        prefix=settings.API_V1_STR
    )



    return application




app = get_application()



@app.get("/")
def root():

    return {

        "message":
        f"Welcome to the {settings.PROJECT_NAME} API. Visit /docs for the API documentation."

    }