import logging
import requests
from typing import Dict, Any, List
from fastapi import HTTPException, status
from app.config import settings

logger = logging.getLogger(__name__)

class GitHubClient:
    """
    Client for interacting with the GitHub REST API.
    Handles authentication, error handling, pagination, and rate limiting.
    """
    BASE_URL = "https://api.github.com"

    def __init__(self):
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        # Attach token if provided in the environment variables
        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

    def _handle_response(self, response: requests.Response) -> Any:
        """
        Validates the GitHub API response and translates standard HTTP errors
        into FastAPI HTTPExceptions.
        """
        if response.status_code == 200:
            return response.json()
            
        elif response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GitHub user or resource not found."
            )
            
        elif response.status_code == 403:
            # Detect rate limiting
            if "X-RateLimit-Remaining" in response.headers and response.headers["X-RateLimit-Remaining"] == "0":
                reset_time = response.headers.get("X-RateLimit-Reset", "Unknown")
                logger.warning(f"GitHub API rate limit exceeded. Resets at timestamp {reset_time}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="GitHub API rate limit exceeded. Please try again later."
                )
            
            # Standard 403 (e.g., bad token)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden by GitHub API. Check your token permissions."
            )
            
        else:
            logger.error(f"GitHub API error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Error communicating with GitHub API: {response.reason}"
            )

    def get_user_profile(self, username: str) -> Dict[str, Any]:
        """
        Fetches the basic profile information for a GitHub user.
        """
        url = f"{self.BASE_URL}/users/{username}"
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            return self._handle_response(response)
        except requests.RequestException as e:
            logger.error(f"Network error fetching user {username}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network error communicating with GitHub."
            )

    def get_user_repositories(self, username: str) -> List[Dict[str, Any]]:
        """
        Fetches all public repositories for a GitHub user.
        Handles pagination to retrieve the complete list.
        """
        url = f"{self.BASE_URL}/users/{username}/repos"
        repos = []
        page = 1
        per_page = 100  # Max allowed by GitHub per request

        try:
            while True:
                params = {
                    "type": "owner",
                    "sort": "updated",
                    "per_page": per_page,
                    "page": page
                }
                response = requests.get(url, headers=self.headers, params=params, timeout=10)
                page_data = self._handle_response(response)
                
                if not page_data:
                    break
                    
                repos.extend(page_data)
                
                # If we received less than the maximum per page, we've hit the end
                if len(page_data) < per_page:
                    break
                    
                page += 1
                
            return repos
            
        except requests.RequestException as e:
            logger.error(f"Network error fetching repos for {username}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Network error communicating with GitHub."
            )

# Create a singleton instance to be imported and used by services
github_client = GitHubClient()
