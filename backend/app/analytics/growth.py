from typing import List, Any
from datetime import datetime

def calculate_growth_metrics(profile: Any, repos: List[Any]) -> float:
    """
    Calculates a growth score based on repository update velocity and network reach.
    Returns a score from 0.0 to 100.0.
    """
    if not repos:
        return 0.0
        
    # For MVP, we look at how many repos were recently updated
    now = datetime.utcnow()
    recent_active_repos = 0
    
    for repo in repos:
        if repo.updated_at:
            days_since_update = (now - repo.updated_at).days
            if days_since_update < 90: # Updated in the last 3 months
                recent_active_repos += 1
                
    activity_ratio = recent_active_repos / len(repos)
    
    # Base growth on recent activity ratio and normalized follower count
    base_growth = (activity_ratio * 50) + min(50, profile.followers / 5.0)
    
    return round(min(100.0, base_growth), 2)
