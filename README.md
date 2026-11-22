# Teamly 🚀

> **Platform Kolaborasi & Manajemen Tugas Kelompok Mahasiswa Berbasis AI**
> *Dilengkapi Integrasi Notifikasi Gmail Otomatis, Diskusi Feedback Tugas, dan Dukungan Mobile Android Native.*

**Teamly** dirancang khusus untuk mempermudah kolaborasi mahasiswa dalam mengerjakan tugas kelompok dan proyek perkuliahan. Dari perumusan ide awal menggunakan AI, pembagian beban kerja tim yang adil, pemantauan papan Kanban sprint, ruang chat feedback tugas, hingga notifikasi langsung ke email Gmail anggota tim.

---

## ✨ Fitur Unggulan

### 1. 📧 Integrasi Notifikasi Gmail Otomatis (SMTP)
- **Notifikasi Penugasan Tugas Baru**: Setiap kali Project Leader menambahkan tugas baru untuk member, detail tugas (judul, prioritas, deadline, deskripsi) otomatis dikirimkan ke kotak masuk Gmail member tersebut.
- **Notifikasi Pembaruan / Edit Tugas**: Saat status tugas diperbarui (*Belum Mulai* ➔ *Dikerjakan* / *Review* / *Selesai*), batas waktu diubah, atau dialihkan ke anggota lain, notifikasi otomatis terkirim.
- **Undangan Bergabung ke Project**: Member yang baru ditambahkan langsung menerima email undangan resmi bertema Teamly.
- **Tombol Kirim Manual**: Tersedia tombol `✉️ Kirim Email ke Member` di dalam modal tugas untuk mengirimkan rincian tugas secara langsung kapan saja.
- Pengiriman berjalan secara non-blocking (*asynchronous daemon thread*) sehingga performa aplikasi tetap cepat dan responsif.

### 2. 👥 Manajemen Tim & Fitur Edit Anggota
- **Standarisasi Role Kelompok**: Peran anggota tim terstandarisasi menjadi `Project Leader` dan `Member`.
- **Fitur Edit Teman Kelompok**: Edit nama lengkap, peran, email Gmail, dan warna avatar anggota tim kapan saja melalui modal edit anggota tim.
- **Anti-Duplikasi Anggota**: Sistem mencegah pendaftaran anggota ganda berdasarkan nama maupun email.

### 3. 💬 Ruang Chat & Feedback Tugas Terpisah
- Modal tugas dipisah menjadi 2 bagian terstruktur:
  - **Tab 1: Detail & Pengaturan Tugas** (Judul, Kategori, Slot Waktu, Prioritas, Penanggung Jawab, Deadline, dan Status).
  - **Tab 2: Ruang Chat & Feedback** (Diskusi interaktif antara Leader dan Member dengan chat bubble dan badge peran `👑 Project Leader` / `👤 Member`).
- Semua percakapan tersimpan secara persisten di database backend.

### 4. 👁️ Pembedaan Sudut Pandang (Role-Based Perspective)
- **Project Leader**: Kontrol penuh untuk membuat proyek, mengelola anggota tim, membagikan tugas, dan memantau analitik.
- **Member**: Tampilan terfokus dengan banner sudut pandang member dan fitur toggle cepat:
  - *"Tugas Saya"* (fokus pengerjaan individu).
  - *"Semua Tugas Tim"* (transparansi progres tim).

### 5. 📋 Papan Kanban & Timeline Sprint
- Visualisasi alur pengerjaan tugas 4 kolom: **Belum Mulai**, **Dikerjakan**, **Review**, dan **Selesai**.
- Pelacakan beban kerja (*workload balance*) dan deteksi otomatis tugas yang melewati batas pengumpulan (*overdue*).

### 6. 💡 Generator Ide Proyek AI & Asisten Cerdas
- Survey interaktif per-halaman untuk menentukan domain minat, topik kuliah, platform target, dan jumlah anggota.
- AI otomatis merumuskan rekomendasi proyek lengkap beserta daftar fitur dan *tech stack* (didukung Google Gemini API).

### 7. 📱 Dukungan Mobile Native Android
- Terintegrasi penuh dengan **Capacitor** (`com.teamly.app`) untuk di-build menjadi aplikasi Android (.APK) native.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend Web** | React 18, Vite, Lucide Icons, CSS3 Modern (Responsive Mobile & Desktop) |
| **Backend API** | FastAPI (Python 3.10+), SQLAlchemy, Pydantic v2 |
| **Database** | SQLite (Default: `teampilot.db`) / PostgreSQL ready |
| **Email Service** | Python `smtplib`, `email.message`, Gmail SMTP (TLS Port 587) |
| **AI Integration** | Google Gemini API (`gemini-2.0-flash`) & Rule-based fallback |
| **Mobile Runtime** | Capacitor 7 (Android Studio Native Project) |

---

## 🚀 Panduan Menjalankan Proyek

### 1. Persiapan Backend (FastAPI)

1. Buka terminal di folder `backend`:
   ```bash
   cd backend
   ```
2. Buat dan aktifkan virtual environment Python:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate   # Linux/macOS: source .venv/bin/activate
   ```
3. Install dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Konfigurasi file `.env`:
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan lengkapi konfigurasi Gmail SMTP:
   ```env
   # Konfigurasi Notifikasi Gmail SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=emailkamu@gmail.com
   SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Gunakan 16-digit Google App Password
   SMTP_FROM_EMAIL=emailkamu@gmail.com
   SMTP_USE_TLS=true
   ```
   > **Cara Mendapatkan Google App Password (Sandi Aplikasi):**
   > 1. Buka [myaccount.google.com/security](https://myaccount.google.com/security).
   > 2. Aktifkan **Verifikasi 2-Langkah** (2-Step Verification).
   > 3. Cari menu **Sandi Aplikasi** (App Passwords) atau buka [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   > 4. Beri nama aplikasi (misal: `Teamly`), klik **Buat**, lalu salin 16 karakter kodenya ke `SMTP_PASSWORD` tanpa spasi.

5. Jalankan server FastAPI:
   ```powershell
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
   ```
   - API Backend aktif di: `http://localhost:8000`
   - Dokumentasi Interaktif (Swagger UI): `http://localhost:8000/docs`

---

### 2. Persiapan Frontend (React + Vite)

1. Buka terminal baru di folder `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Jalankan server development Vite:
   ```bash
   npm run dev
   ```
3. Buka browser di: `http://localhost:5173`

> **Akun Default untuk Demo / Login Awal:**
> - Email: `admin@teamly.com`
> - Kata Sandi: `admin123`
> *(Atau daftar akun baru dengan email Gmail asli Anda melalui tab **Daftar Akun**).*

---

### 3. Build Aplikasi Android (.APK) 📱

Aplikasi ini sudah dikonfigurasi penuh dengan **Capacitor**:

```bash
cd frontend

# 1. Build aset web production
npm run build

# 2. Sinkronisasikan ke folder Android native
npm run cap:sync

# 3. Buka proyek di Android Studio
npx cap open android
```

**Langkah Pembuatan APK di Android Studio:**
1. Di Android Studio, tunggu sinkronisasi Gradle selesai.
2. Pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Setelah selesai, klik **locate** untuk mendapatkan file `app-debug.apk` yang siap dipasang di smartphone Android.

---

## 📡 Daftar Endpoint API Utama

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Mendaftarkan akun baru (langsung aktif) |
| `POST` | `/api/auth/login` | Masuk ke akun & auto-link data anggota tim |
| `GET` | `/api/auth/me` | Mengambil data sesi pengguna saat ini |
| `GET/POST`| `/api/projects` | Mengambil daftar project & membuat project baru |
| `GET/DEL` | `/api/projects/{pid}` | Detail project & menghapus project |
| `GET/POST`| `/api/projects/{pid}/members` | Daftar anggota tim & menambah anggota (+ notif email) |
| `PATCH` | `/api/projects/{pid}/members/{mid}` | Mengedit data anggota tim (nama, role, email, avatar) |
| `DELETE` | `/api/projects/{pid}/members/{mid}` | Menghapus anggota tim |
| `GET/POST`| `/api/projects/{pid}/tasks` | Daftar tugas & membuat tugas baru (+ notif email) |
| `PATCH` | `/api/tasks/{tid}` | Memperbarui tugas (+ notif email pembaruan) |
| `POST` | `/api/tasks/{tid}/notify` | Mengirim manual email rincian tugas ke member |
| `GET/POST`| `/api/tasks/{tid}/comments` | Mengambil & mengirim pesan feedback tugas |
| `POST` | `/api/test-email` | Menguji pengiriman email SMTP Gmail |
| `GET` | `/api/projects/{pid}/analytics`| Data analitik beban kerja tim dan progres sprint |
| `POST` | `/api/ai/chat` | Konsultasi asisten AI pembimbing proyek |

---

## 👥 Tim Pengembang
Dikembangkan oleh **Kelompok 6 — Kelas C Pemrograman Mobile**.
Dibuat untuk kebutuhan kolaborasi dan manajemen tugas kelompok perkuliahan secara modern, adil, dan transparan.
