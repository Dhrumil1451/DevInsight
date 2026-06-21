# 🚀 DevInsight

DevInsight is a GitHub developer analytics platform that analyzes developer profiles, repositories, coding diversity, repository health, and activity patterns to generate meaningful insights.

The platform fetches GitHub data, stores it locally, calculates developer metrics, compares developers, tracks trending profiles, saves favorite developers, and generates downloadable analytics reports.

---

# ✨ Features

## 👤 Developer Profile Analysis

- Fetch GitHub developer profiles
- Store profile information
- View:
  - Name
  - Username
  - Followers
  - Public repositories
  - Company
  - Location


## 📂 Repository Analytics

- Fetch public GitHub repositories
- Cache repository data
- Analyze:

  - Programming languages
  - Stars
  - Forks
  - Open issues


## 📊 Developer Analytics Engine

DevInsight calculates:

### Developer Score

A weighted score based on:

- Contribution score
- Growth score
- Language diversity
- Repository health


### Language Diversity

Analyzes:

- Most used language
- Total languages
- Language distribution


### Repository Health

Analyzes repository quality using:

- Stars
- Forks
- Open issues


### Growth Analysis

Measures developer activity trends.

---

# ⚔️ Developer Comparison

Compare two GitHub developers side-by-side.

Example:

/api/compare?user1=torvalds&user2=gvanrossum


Provides:

- Profiles
- Developer scores
- Analytics breakdown
- Insights


---

# 🔥 Trending Developers

Tracks search frequency and displays trending developers.

Example:

/api/trending



---

# ⭐ Saved Developers

Users can save developers for later viewing.

Example:


/api/saved



---

# 📄 PDF Reports

Generate downloadable developer reports.

Includes:

- Profile information
- Analytics score
- Language analysis
- Repository health
- Generated insights


---

# 🏗️ Project Architecture

app/

├── api/
│ └── API routes

├── services/
│ └── Business logic

├── repositories/
│ └── Database operations

├── models/
│ └── SQLAlchemy models

├── schemas/
│ └── Pydantic response models

├── analytics/
│ └── Analytics engine

├── core/
│ └── Exception handling

└── database.py




---

# 🛠️ Tech Stack

Backend:

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- ReportLab


External:

- GitHub REST API


---

# ⚙️ Installation


Clone repository:

```bash
git clone <repository-url>


Go inside backend:

cd backend

Create virtual environment:

python -m venv venv

Activate:

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Create environment file:

.env

Example:

PROJECT_NAME=DevInsight
DATABASE_URL=sqlite:///./devinsight.db
GITHUB_TOKEN=your_token

Run server:

uvicorn app.main:app --reload

API documentation:

http://127.0.0.1:8000/docs
🔌 API Endpoints
Health
GET /api/health
Developer Profile
GET /api/users/{username}
Repositories
GET /api/repositories/{username}
Analytics
GET /api/analytics/{username}
Compare Developers
GET /api/compare
Trending
GET /api/trending
Saved Developers
GET /api/saved
Reports

Generate:

POST /api/reports/{username}

Download:

GET /api/reports/{report_id}
🛡️ Error Handling

All API errors follow a consistent format:

{
 "success": false,
 "message": "Resource not found",
 "error_code": "RESOURCE_NOT_FOUND"
}
🎯 Future Improvements
React frontend dashboard
Authentication system
More advanced ML-based developer scoring
Cloud deployment
PostgreSQL support