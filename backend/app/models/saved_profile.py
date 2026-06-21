from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class SavedProfile(Base):
    __tablename__ = "saved_profiles"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("developer_profiles.id", ondelete="CASCADE"), nullable=False)
    
    saved_at = Column(DateTime, default=datetime.utcnow)
    custom_notes = Column(Text, nullable=True)

    # Relationships
    profile = relationship("DeveloperProfile", back_populates="saved_profiles")
