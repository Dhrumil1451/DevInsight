# 🚀 DevInsight

DevInsight is a modern GitHub developer analytics platform. It provides deep, AI-powered insights, custom contribution scoring, repository health analysis, and side-by-side developer comparisons.

## ✨ Features

- **🔍 Advanced Search:** Analyze any public GitHub developer profile instantly.
- **🏆 Developer Score:** A proprietary composite score measuring contribution impact, growth velocity, language breadth, and repository quality.
- **📊 Language Analytics:** Visual language distribution across all public repositories.
- **⚖️ Side-by-Side Compare:** Compare two developers on any metric with interactive radar charts.
- **📈 Trending & Saved:** Discover the most searched developers and save your favorites to a personal collection.
- **📄 PDF Reports:** Generate and download complete analytics PDF reports for any developer.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (Dark Mode supported)
- **Routing:** React Router v6
- **Data Fetching:** Axios
- **Charts:** Recharts

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite + SQLAlchemy ORM
- **API Integration:** GitHub REST API
- **PDF Generation:** ReportLab
- **Testing:** Pytest

## 🏗️ Architecture & Folder Structure

```text
DevInsight/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Route Handlers
│   │   ├── core/             # Config, Security, Exception Handlers
│   │   ├── database.py       # SQLAlchemy setup
│   │   ├── models/           # DB Models
│   │   ├── schemas/          # Pydantic Schemas
│   │   └── services/         # Business Logic & GitHub API calls
│   ├── tests/                # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/                 # React Application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── hooks/            # Custom React hooks
    │   ├── layouts/          # Page layouts (Navbar)
    │   ├── pages/            # Route pages (Home, Profile, Compare)
    │   ├── services/         # Axios API configuration
    │   └── utils/            # Helper functions
    ├── .env.example
    └── package.json
```

## 🚀 Setup Instructions

### 1. Backend Setup

The backend can be run using Docker or locally.

**Using Docker (Recommended):**
```bash
cd backend
docker compose up --build
```

**Local Setup:**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Create environment variables based on example
cp .env.example .env
npm run dev
```

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (`backend/.env`)
```env
# Optional: GitHub Token for higher rate limits
# GITHUB_TOKEN=your_personal_access_token
```

## 📚 API Documentation

Once the backend is running, you can access the interactive Swagger API documentation at:

👉 **http://localhost:8000/docs**

---

*Built with ❤️ for developers, by developers.*
