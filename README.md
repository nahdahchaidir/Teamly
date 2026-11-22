# Teamly 🚀

> **Platform Kolaborasi & Manajemen Tugas Kelompok Mahasiswa Berbasis AI**
> *Dilengkapi Generator Ide Cerdas, Papan Kanban Terintegrasi Email Gmail, Ruang Chat Feedback, dan Dukungan Mobile Android Native.*

**Teamly** dirancang khusus untuk membantu mahasiswa dalam merumuskan konsep tugas kuliah dari nol, membagi beban kerja secara adil, memantau alur pengerjaan sprint tugas kelompok, hingga bertukar feedback secara intensif melalui chat dan notifikasi email otomatis.

---

## ✨ Fitur Unggulan

### 1. 💡 Temukan Ide (AI Project Generator)
Fitur perumusan konsep proyek berbasis kecerdasan buatan (didukung Google Gemini API) untuk membantu kelompok mahasiswa yang kebingungan menentukan judul dan ruang lingkup tugas kuliah:
- **Survey Interaktif Terpandu**: Kuesioner bertahap untuk menyesuaikan domain minat (*Kampus, UMKM, Edukasi, Kesehatan, Lingkungan*), topik mata kuliah (*Pemrograman Web, Mobile, RPL, Basis Data, AI*), platform target (*Web App, Mobile Native, Cross-platform, API*), ukuran tim, dan tingkat kesulitan.
- **Rekomendasi Konsep Proyek Matang**: Menghasilkan 3 alternatif rekomendasi proyek kreatif lengkap dengan nama proyek, *tagline*, latar belakang masalah, dan ringkasan solusi yang aplikatif.
- **Rekomendasi Tech Stack & Fitur MVP**: Panduan teknologi yang relevan (frontend, backend, database) serta daftar fitur-fitur esensial yang siap dikembangkan.
- **Breakdown Tugas Otomatis (Task Seeding)**: Setiap ide dilengkapi daftar modul tugas awal terstruktur yang dapat langsung diadopsi ke dalam papan tugas proyek kelompok hanya dengan satu klik.

---

### 2. 📊 Dashboard (Ikhtisar Proyek & Analitik)
Pusat kendali dan transparansi progres tugas kelompok untuk memastikan seluruh target proyek tercapai tepat waktu:
- **Statistik Sprint Real-Time**: Ringkasan metrik instan yang menampilkan Total Tugas, Tugas Selesai, Tugas Berjalan, Tugas Terlambat (*Overdue*), dan Persentase Progres Penyelesaian Proyek.
- **Peringatan Batas Waktu (Deadline & Overdue Warning)**: Pemantauan visual otomatis untuk tugas-tugas yang mendekati tenggat pengumpulan maupun yang telah melewati batas waktu agar kelompok dapat segera melakukan evaluasi.
- **Analitik Beban Kerja Tim (Workload Balance)**: Visualisasi grafik beban jam kerja dan jumlah tugas aktif per anggota untuk menjamin pembagian tanggung jawab yang adil dan merata.
- **Asisten AI Pembimbing (AI Insights & Chat)**: Fitur konsultasi interaktif terintegrasi AI untuk menganalisis risiko jadwal pengerjaan, membantu perumusan bab laporan kuliah, serta memberi rekomendasi solusi saat tim mengalami kendala teknis.

---

### 3. 📋 Papan Tugas (Kanban Sprint & Feedback Chat)
Manajemen pengerjaan tugas visual yang dilengkapi ruang diskusi interaktif dan sistem notifikasi otomatis:
- **Visualisasi Kanban 4 Alur Kerja**: Manajemen kartu tugas dinamis melintasi 4 tahap pengerjaan: **Belum Mulai** (*Todo*), **Dikerjakan** (*Doing*), **Review**, dan **Selesai** (*Done*).
- **Pengaturan Tugas Menyeluruh**: Rincian lengkap meliputi judul tugas, kategori pekerjaan, slot waktu pengerjaan harian, level prioritas (*Rendah, Sedang, Tinggi*), penanggung jawab (*assignee*), tenggat waktu, dan estimasi waktu pengerjaan.
- **Ruang Chat & Feedback Terpisah**: Tab khusus diskusi interaktif di dalam modal tugas yang terpisah rapi dari pengaturan teknis tugas. Leader dan Member dapat berdiskusi secara leluasa dengan tampilan bubble chat dan lencana peran resmi (`👑 Project Leader` / `👤 Member`).
- **Notifikasi Email Otomatis (Gmail SMTP)**:
  - Setiap penambahan tugas baru otomatis mengirimkan rincian tugas (judul, prioritas, deadline, catatan) ke kotak masuk email Gmail member yang ditugaskan.
  - Setiap pembaruan atau pengeditan tugas (perubahan status, perpanjangan deadline, atau perubahan catatan) otomatis mengirimkan email notifikasi pembaruan ke member terkait.
  - Tersedia tombol manual `✉️ Kirim Email ke Member` di dalam modal tugas untuk mengirimkan rincian tugas ke inbox Gmail member kapan saja.
- **Pembedaan Sudut Pandang Peran (Role Perspective)**: Member memiliki toggle filter cepat *"Tugas Saya"* untuk fokus pada tanggung jawab pribadi serta *"Semua Tugas Tim"* untuk transparansi pengerjaan tugas anggota lain.

---

### 4. 👥 Collab Tim (Manajemen Anggota Kelompok)
Ruang kolaborasi terstruktur untuk mengatur susunan tim, pembagian peran, dan sinkronisasi akun anggota:
- **Standarisasi Peran Kelompok**: Peran tim terstandarisasi menjadi 2 tingkatan yang jelas: `Project Leader` dan `Member`.
- **Fitur Edit Teman Kelompok**: Fleksibilitas mengedit nama lengkap, peran tim, alamat email Gmail, serta warna avatar anggota kelompok kapan saja melalui modal edit anggota tim.
- **Proteksi Anti-Duplikasi Anggota**: Validasi cerdas untuk mencegah pendaftaran anggota ganda (*duplicate member*) di dalam satu proyek berdasarkan nama maupun alamat email.
- **Undangan Proyek via Email**: Saat anggota baru ditambahkan menggunakan email Gmail, sistem otomatis mengirimkan email undangan resmi bertema Teamly yang memuat nama proyek dan peran yang diberikan.
- **Sinkronisasi Akun Otomatis**: Anggota yang mendaftar atau masuk (*login*) menggunakan email aslinya akan langsung terhubung ke proyek kelompok yang melibatkan dirinya secara otomatis tanpa perlu setup tambahan.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|---|---|
| **Frontend Web** | React 18, Vite, Lucide React Icons, CSS3 Modern (Responsive Mobile & Desktop) |
| **Backend API** | FastAPI (Python 3.10+), SQLAlchemy, Pydantic v2 |
| **Database** | SQLite (Default: `teampilot.db`) / PostgreSQL ready |
| **Email Service** | Python `smtplib`, `email.message`, Gmail SMTP (Port 587 TLS) |
| **AI Integration** | Google Gemini API (`gemini-2.0-flash`) & Rule-based fallback |
| **Mobile Native** | Capacitor 7 (Android Native Project) |

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan Backend (FastAPI)

1. Buka terminal di folder `backend`:
   ```bash
   cd backend
   ```
2. Buat dan aktifkan virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate   # Linux/macOS: source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Konfigurasi file `.env`:
   Salin `.env.example` menjadi `.env` lalu sesuaikan konfigurasi Gmail SMTP Anda:
   ```env
   # Konfigurasi Notifikasi Gmail SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=emailkamu@gmail.com
   SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Google App Password 16 karakter
   SMTP_FROM_EMAIL=emailkamu@gmail.com
   SMTP_USE_TLS=true
   ```
   > **Cara Mendapatkan Google App Password (Sandi Aplikasi):**
   > 1. Buka [myaccount.google.com/security](https://myaccount.google.com/security)
   > 2. Aktifkan **Verifikasi 2-Langkah** (2-Step Verification)
   > 3. Masuk ke menu **Sandi Aplikasi** (App Passwords)
   > 4. Buat sandi aplikasi baru dengan nama `Teamly` dan salin 16 karakter kodenya ke `SMTP_PASSWORD` tanpa spasi.

5. Jalankan server FastAPI:
   ```powershell
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
   ```
   - API Aktif: `http://localhost:8000`
   - Dokumentasi Swagger UI: `http://localhost:8000/docs`

---

### 2. Menjalankan Frontend (React + Vite)

1. Buka terminal baru di folder `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Jalankan server Vite:
   ```bash
   npm run dev
   ```
3. Buka di browser: `http://localhost:5173`

> **Akun Default untuk Uji Coba Awal:**
> - Email: `admin@teamly.com`
> - Password: `admin123`
> *(Atau Anda dapat langsung mendaftarkan akun baru dengan email Gmail asli Anda).*

---

### 3. Build Aplikasi Android Native (.APK) 📱

Aplikasi ini telah terintegrasi penuh dengan **Capacitor**:

```bash
cd frontend

# 1. Build berkas produksi frontend
npm run build

# 2. Sinkronisasikan aset ke proyek Android native
npm run cap:sync

# 3. Buka proyek di Android Studio
npx cap open android
```

**Membuat File APK di Android Studio:**
1. Buka Android Studio dan tunggu proses sinkronisasi Gradle selesai.
2. Klik menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Setelah proses selesai, klik notifikasi **locate** untuk mendapatkan file `.apk` siap pasang di smartphone Android.

---

## 📡 Ringkasan Endpoint API Utama

| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/auth/register` | Pendaftaran akun baru (langsung aktif) |
| `POST` | `/api/auth/login` | Autentikasi akun & sinkronisasi data member |
| `GET` | `/api/auth/me` | Mengambil data sesi pengguna aktif |
| `GET/POST`| `/api/projects` | Mengambil daftar project & membuat project baru |
| `GET/DEL` | `/api/projects/{pid}` | Mengambil detail project & menghapus project |
| `GET/POST`| `/api/projects/{pid}/members` | Daftar anggota tim & menambah anggota (+ notif email undangan) |
| `PATCH` | `/api/projects/{pid}/members/{mid}` | Mengedit anggota tim (nama, peran, email, avatar) |
| `DELETE` | `/api/projects/{pid}/members/{mid}` | Menghapus anggota tim |
| `GET/POST`| `/api/projects/{pid}/tasks` | Daftar tugas & membuat tugas baru (+ notif email tugas) |
| `PATCH` | `/api/tasks/{tid}` | Memperbarui tugas (+ notif email pembaruan) |
| `POST` | `/api/tasks/{tid}/notify` | Tombol manual kirim rincian tugas ke email member |
| `GET/POST`| `/api/tasks/{tid}/comments` | Mengambil & mengirim pesan chat feedback tugas |
| `POST` | `/api/ai/chat` | Konsultasi asisten AI pembimbing tugas |
| `POST` | `/api/ai/generate-project-idea` | Generator perumusan ide tugas kelompok berbasis AI |

---

## 👥 Tim Pengembang
Dikembangkan oleh **Kelompok 6 — Kelas C Pemrograman Mobile**.
Dibuat untuk kebutuhan kolaborasi dan manajemen tugas kelompok perkuliahan secara modern, adil, dan transparan.
