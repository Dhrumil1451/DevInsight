from typing import List, Dict, Any
from app.models.repository import Repository

def calculate_language_diversity(repos: List[Repository]) -> Dict[str, Any]:
    """
    Analyzes the primary languages of a user's repositories to determine language diversity.
    
    Args:
        repos (List[Repository]): A list of repository objects. Each object must have a 'language' attribute.
        
    Returns:
        Dict[str, Any]: A dictionary containing:
            - most_used_language (str): The language appearing in the most repositories.
            - total_languages (int): The count of unique languages used.
            - distribution (List[Dict[str, Any]]): A list showing the frequency of each language.
    """
    if not repos:
        return {
            "most_used_language": "",
            "total_languages": 0,
            "distribution": []
        }
        
    language_counts: Dict[str, int] = {}
    
    # Calculate language frequency, ignoring repositories where language is None or empty
    for repo in repos:
        if repo.language:
            language_counts[repo.language] = (
                language_counts.get(repo.language, 0) + 1
            )
            
    if not language_counts:
        return {
            "most_used_language": "",
            "total_languages": 0,
            "distribution": []
        }
        
    # Sort languages by frequency descending
    sorted_langs = sorted(language_counts.items(), key=lambda x: x[1], reverse=True)
    
    most_used_language = sorted_langs[0][0]
    total_languages = len(sorted_langs)
    
    # Format the distribution list
    distribution = [
        {"language": lang, "count": count}
        for lang, count in sorted_langs
    ]
    
    return {
        "most_used_language": most_used_language,
        "total_languages": total_languages,
        "distribution": distribution
    }
