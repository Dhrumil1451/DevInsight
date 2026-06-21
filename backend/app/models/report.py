from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("developer_profiles.id", ondelete="CASCADE"), nullable=False)
    
    file_path = Column(String(500), nullable=False)
    report_type = Column(String(50), nullable=False, default="pdf")
    
    generated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    profile = relationship("DeveloperProfile", back_populates="reports")
