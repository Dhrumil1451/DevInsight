from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("developer_profiles.id", ondelete="CASCADE"), nullable=False)
    
    developer_score = Column(Float, default=0.0)
    language_diversity = Column(Float, default=0.0)
    growth_score = Column(Float, default=0.0)
    contribution_score = Column(Float, default=0.0)
    repo_health_average = Column(Float, default=0.0)
    
    total_languages = Column(Integer, default=0)
    most_used_language = Column(String(100), nullable=True)
    
    # IMPROVEMENT 2: Added language distribution JSON column
    language_distribution = Column(JSON, nullable=True)
    
    snapshot_date = Column(DateTime, default=datetime.utcnow)
    generated_insights = Column(Text, nullable=True)

    # Relationships
    profile = relationship("DeveloperProfile", back_populates="analytics_snapshots")
