# TeamPilot AI — Backend

FastAPI backend with JWT authentication, project/member/task CRUD, analytics, report endpoint and optional Gemini-powered AI coach.

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

SQLite is used by default. To use PostgreSQL, create a database and set `DATABASE_URL=postgresql+psycopg://USER:PASSWORD@localhost:5432/teampilot` in `.env`.

To enable Gemini, add your `GEMINI_API_KEY` to `.env`. Without a key, the app returns a transparent rule-based coaching fallback.

## Main endpoints
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/projects`, `GET/DELETE /api/projects/{id}`
- `GET/POST /api/projects/{id}/members`
- `GET/POST /api/projects/{id}/tasks`, `PATCH/DELETE /api/tasks/{id}`
- `GET /api/projects/{id}/analytics`, `/insights`, `/report`
- `POST /api/ai/chat`

This is an MVP starter, not production-hardened. Add tests, migrations, rate limiting, email verification, role-based access and audit controls before public deployment.
