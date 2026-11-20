# Teamly — Backend API

FastAPI backend untuk autentikasi JWT, manajemen proyek, anggota tim, papan tugas (Kanban), analitik beban kerja, dan asisten AI.

## Cara Menjalankan

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

- API Docs: `http://localhost:8000/docs`
- Database default: SQLite (`teamly.db` / `teampilot.db`)
- Opsional: Tambahkan `GEMINI_API_KEY` pada `.env` untuk mengaktifkan respons AI via Google Gemini.

## Endpoint Utama
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/projects`, `GET/DELETE /api/projects/{id}`
- `GET/POST /api/projects/{id}/members`
- `GET/POST /api/projects/{id}/tasks`, `PATCH/DELETE /api/tasks/{id}`
- `GET /api/projects/{id}/analytics`, `/report`
- `POST /api/ai/chat`
