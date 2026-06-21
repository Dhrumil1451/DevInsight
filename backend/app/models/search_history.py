from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), index=True, nullable=False)
    searched_at = Column(DateTime, default=datetime.utcnow)
    search_source = Column(String(50), nullable=True)
    
    profile_id = Column(Integer, ForeignKey("developer_profiles.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    profile = relationship("DeveloperProfile", back_populates="search_history")
