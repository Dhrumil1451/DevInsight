from pydantic import BaseModel
from datetime import datetime

class ReportGenerateData(BaseModel):
    report_id: int
    status: str

class ReportGenerateResponse(BaseModel):
    success: bool
    message: str
    data: ReportGenerateData

class ReportMetadataResponse(BaseModel):
    id: int
    profile_id: int
    file_path: str
    report_type: str
    generated_at: datetime

    class Config:
        from_attributes = True
