from typing import List, Any

def calculate_health_average(repos: List[Any]) -> float:
    """
    Evaluates the maintainability of public code.
    Factors in Open Issues against the traction (forks + stars) of the repository.
    Returns an average health score out of 100.0.
    """
    if not repos:
        return 0.0
        
    total_health = 0.0
    valid_repos = 0
    
    for repo in repos:
        # We only evaluate health for repos with some minimal traction or issues
        if repo.stargazers_count > 0 or repo.open_issues_count > 0:
            valid_repos += 1
            
            # Traction heuristic
            traction = repo.stargazers_count + (repo.forks_count * 2)
            issues = repo.open_issues_count
            
            # If no traction but has issues, health is lower
            if traction == 0:
                health = max(0.0, 100 - (issues * 10))
            else:
                # Ratio of issues to traction. 
                penalty = min(100.0, (issues / traction) * 50.0)
                health = 100.0 - penalty
                
            total_health += health
            
    if valid_repos == 0:
        return 80.0 # Neutral positive baseline for empty/small repos
        
    return round(total_health / valid_repos, 2)
