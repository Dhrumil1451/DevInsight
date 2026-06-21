from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse


async def http_exception_handler(
    request: Request,
    exc: HTTPException
):

    error_code = "HTTP_ERROR"


    if exc.status_code == 404:
        error_code = "RESOURCE_NOT_FOUND"

    elif exc.status_code == 401:
        error_code = "UNAUTHORIZED"

    elif exc.status_code == 403:
        error_code = "FORBIDDEN"

    elif exc.status_code == 400:
        error_code = "BAD_REQUEST"


    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "error_code": error_code
        }
    )

async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error",
            "error_code": "VALIDATION_ERROR",
            "details": exc.errors()
        }
    )

async def database_exception_handler(
    request: Request,
    exc: SQLAlchemyError
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Database error",
            "error_code": "DATABASE_ERROR"
        }
    )

async def general_exception_handler(
    request: Request,
    exc: Exception
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )
