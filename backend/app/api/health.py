from fastapi import APIRouter

router = APIRouter()

@router.get("/health", response_model=dict, tags=["health"])
def health_check():
    """
    Health check endpoint for API monitoring and deployment verification.
    """
    return {"status": "healthy"}
