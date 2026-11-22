# Teamly — Backend API 🚀

FastAPI backend untuk autentikasi JWT, manajemen proyek kelompok, anggota tim, papan tugas (Kanban), analitik beban kerja, integrasi notifikasi Gmail SMTP, ruang chat feedback tugas, dan asisten AI.

---

## 🛠️ Cara Menjalankan

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate       # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

- **Swagger UI Interactive Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Database default**: SQLite (`teampilot.db`)

---

## 📧 Konfigurasi Gmail SMTP

Isi kredensial di file `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=emailkamu@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Google App Password 16 karakter (tanpa spasi)
SMTP_FROM_EMAIL=emailkamu@gmail.com
SMTP_USE_TLS=true
```

> **Catatan App Password:**
> 1. Buka [myaccount.google.com/security](https://myaccount.google.com/security)
> 2. Aktifkan **Verifikasi 2-Langkah**
> 3. Masuk ke **Sandi Aplikasi** (App Passwords)
> 4. Generate sandi 16 karakter untuk aplikasi Teamly dan masukkan ke `SMTP_PASSWORD`.

---

## 📡 Daftar Endpoint Lengkap

### Autentikasi
- `POST /api/auth/register` — Mendaftar akun baru (langsung aktif)
- `POST /api/auth/login` — Masuk dan mendapatkan JWT token
- `GET /api/auth/me` — Mendapatkan profil user yang sedang login

### Project & Anggota
- `GET /api/projects` — Mengambil semua project milik user atau di mana user terdaftar sebagai member
- `POST /api/projects` — Membuat project baru
- `GET /api/projects/{pid}` — Mengambil detail project
- `DELETE /api/projects/{pid}` — Menghapus project (khusus owner)
- `GET /api/projects/{pid}/members` — Mengambil daftar anggota tim
- `POST /api/projects/{pid}/members` — Menambah anggota tim (+ notifikasi email undangan)
- `PATCH /api/projects/{pid}/members/{mid}` — Mengedit nama, role, dan email anggota tim
- `DELETE /api/projects/{pid}/members/{mid}` — Menghapus anggota tim

### Tugas & Feedback
- `GET /api/projects/{pid}/tasks` — Mengambil daftar tugas dalam project
- `POST /api/projects/{pid}/tasks` — Membuat tugas baru (+ notifikasi email penugasan ke member)
- `PATCH /api/tasks/{tid}` — Memperbarui detail/status tugas (+ notifikasi email pembaruan)
- `DELETE /api/tasks/{tid}` — Menghapus tugas
- `POST /api/tasks/{tid}/notify` — Mengirim manual email notifikasi rincian tugas ke member
- `GET /api/tasks/{tid}/comments` — Mengambil daftar pesan feedback tugas
- `POST /api/tasks/{tid}/comments` — Mengirim komentar feedback tugas

### Analitik & AI
- `GET /api/projects/{pid}/analytics` — Data beban kerja tim dan progres tugas
- `GET /api/projects/{pid}/insights` — Analisis AI tentang risiko deadline dan beban kerja
- `POST /api/ai/chat` — Tanya jawab asisten AI tentang project
- `POST /api/ai/generate-project-idea` — Generator ide proyek berbasis AI
- `POST /api/test-email` — Menguji pengiriman email Gmail SMTP
