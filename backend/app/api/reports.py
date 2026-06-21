from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db

from app.services.report_service import report_service

from app.schemas.report_schema import (
    ReportGenerateResponse,
    ReportMetadataResponse
)

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/{username}",response_model=ReportGenerateResponse)
def generate_report(username: str, db: Session = Depends(get_db)):
    """
    Generate developer analytics PDF report.
    """
    # Delegate PDF generation and database logging to the service layer
    result = report_service.generate_report(db, username)
    
    return {
        "success": True,
        "message": "Report generated",
        "data": result
    }

@router.get("/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    """
    Retrieve the actual PDF report file.
    """
    report = report_service.get_report(db, report_id)

    return FileResponse(
        path=report.file_path,
        media_type="application/pdf",
        filename="developer_report.pdf"
    )
