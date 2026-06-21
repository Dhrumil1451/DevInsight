from datetime import datetime
from typing import List
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base

class DeveloperProfile(Base):
    __tablename__ = "developer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=True)
    avatar_url = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    company = Column(String(200), nullable=True)
    location = Column(String(200), nullable=True)
    
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    public_repos = Column(Integer, default=0)
    
    account_created_at = Column(DateTime, nullable=True)
    
    total_stars = Column(Integer, default=0)
    total_forks = Column(Integer, default=0)
    developer_score = Column(Float, nullable=True)
    
    last_fetched_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    repositories = relationship("Repository", back_populates="profile", cascade="all, delete-orphan")
    search_history = relationship("SearchHistory", back_populates="profile", cascade="all, delete-orphan")
    analytics_snapshots = relationship("AnalyticsSnapshot", back_populates="profile", cascade="all, delete-orphan")
    saved_profiles = relationship("SavedProfile", back_populates="profile", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="profile", cascade="all, delete-orphan")
