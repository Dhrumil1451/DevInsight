from typing import Optional
from sqlalchemy.orm import Session
from app.models.report import Report

def get_by_id(db: Session, report_id: int) -> Optional[Report]:
    """Fetch a report by its primary key ID."""
    return db.query(Report).filter(Report.id == report_id).first()

def create(db: Session, profile_id: int, file_path: str, report_type: str = "pdf") -> Report:
    """Save metadata for a newly generated PDF report."""
    db_report = Report(profile_id=profile_id, file_path=file_path, report_type=report_type)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
