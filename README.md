# TeamPilot AI — Solusi Ide & Manajemen Tugas Kuliah

Aplikasi pintar untuk membantu mahasiswa merancang ide dan konsep tugas kuliah berbasis masalah nyata, membagi peran kelompok, dan mengelola pengerjaan proyek dengan papan Kanban dan AI Pembimbing.

## Alur Utama Aplikasi (Core Flow)
1. **Input Masalah Nyata**: Mahasiswa menuliskan masalah di sekitar kampus atau memilih contoh masalah yang ingin diselesaikan.
2. **AI Solution Generator**: AI merumuskan konsep proyek, fitur utama, rekomendasi tech stack, pembagian peran kelompok, dan roadmap tugas sprint awal.
3. **1-Click Workspace Setup**: Klik "Gunakan Ide Ini" untuk otomatis membuat proyek, memasukkan tugas ke papan Kanban, dan menyiapkan peran tim.
4. **Eksekusi & Kolaborasi Kelompok**: Pantau progres tugas kuliah, kelola pembagian tugas di papan Kanban, atur beban kerja teman sekelompok, dan konsultasi kendala teknis atau laporan dengan AI Pembimbing.
- Email/password registration and login with JWT
- Project creation and listing
- Project member management endpoint
- Task CRUD, assignees, priorities, deadlines and Kanban-style status updates
- Project progress analytics and workload summary
- AI project insights, AI chat, and progress report endpoints
- Optional Gemini integration through LangChain
- Demo workspace in the frontend so the UI can be explored without API credentials

## Quick start

### 1. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
Backend runs at http://localhost:8000 and Swagger docs at http://localhost:8000/docs.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173.

The UI opens in demo mode. To use real account and persistent API data, select **Create account** from the demo banner or switch to authentication mode in the app state. Backend defaults to SQLite, so no database server is required. PostgreSQL can be enabled by changing `DATABASE_URL` in `backend/.env`.

### 3. Enable Gemini (optional)
Add your Gemini API key to `backend/.env`:
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```
Without a key, the API returns a clearly labeled rule-based coaching fallback; the rest of the application remains usable.

## Notes / limitations of this MVP
- The frontend demo data is local and resets on refresh; authenticated mode persists data in the backend database.
- The current project API is owner-scoped. Member invitation and role-based access controls are not yet implemented as a full collaboration/invitation workflow.
- AI suggestions are advisory and must be reviewed by the team. Workload estimates are based on task estimates, not judgments about member performance.
- For production: add Alembic migrations, automated tests, rate limiting, email verification/password reset, stronger secret management, audit logs, authorization for project members, and deployment configuration.
