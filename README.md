# Teamly 🚀

> Platform Kolaborasi & Generator Ide Tugas Kuliah Mahasiswa berbasis AI.

**Teamly** membantu mahasiswa merumuskan ide konsep tugas kuliah dari nol, membagi beban kerja secara adil, serta memantau pengerjaan tugas kelompok dengan papan Kanban yang rapi dan terstruktur.

---

## ✨ Fitur Utama

1. **💡 Survey Ide AI Instan**
   - Survey interaktif per-halaman untuk menentukan domain minat, platform, topik kuliah, dan ukuran tim.
   - Otomatis merumuskan 3 rekomendasi proyek kreatif lengkap dengan daftar fitur utama dan rekomendasi *tech stack*.
2. **📋 Papan Kanban Sprint**
   - Visualisasi alur tugas yang rapi (*Belum Mulai*, *Dikerjakan*, *Review*, *Selesai*).
   - Penugasan tugas spesifik per anggota, batas tenggat (*deadline*), kategori, dan prioritas.
3. **👥 Manajemen Tim & Beban Kerja Adil**
   - Pemantauan beban kerja (workload) per anggota kelompok secara transparan.
   - Visualisasi timeline tugas harian untuk mempermudah sinkronisasi jadwal kelompok.
4. **🤖 AI Assistant Pembimbing**
   - Konsultasi ide proyek, pembagian bab laporan kuliah, dan solusi kendala pengerjaan tugas.
5. **🎨 Desain Modern & Clean Look**
   - Antarmuka bertema oranye modern yang ramah pengguna dan fokus pada hal terpenting.
   - Tersedia *Mode Demo* untuk mencoba langsung tanpa konfigurasi database awal.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, CSS3 Modern (Clean Look)
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic
- **Database**: SQLite (default) / PostgreSQL
- **AI Integration**: Google Gemini API / Rule-based Fallback Coach

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Backend (FastAPI)
Buka terminal dan jalankan:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Opsional: sesuaikan konfigurasi
uvicorn app.main:app --reload --port 8000
```
- API Backend aktif di: `http://localhost:8000`
- Dokumentasi Swagger UI: `http://localhost:8000/docs`

### 2. Frontend Web (React + Vite)
Buka terminal kedua dan jalankan:
```bash
cd frontend
npm install
npm run dev
```
- Buka browser di: `http://localhost:5173`
- Backend harus tetap berjalan saat masuk atau mendaftar. Jalankan `npm run dev` dari folder utama proyek untuk memulai backend dan frontend sekaligus. Jika frontend dipasang di hosting atau dibuka dari perangkat lain, atur `VITE_API_URL` ke alamat backend yang dapat dijangkau perangkat tersebut.

*(Aplikasi langsung dapat dieksplorasi melalui **Mode Demo**).*

### 3. Aplikasi Mobile Android (Capacitor) 📱
Project ini sudah terkonfigurasi penuh sebagai **Aplikasi Android Native** (`com.teamly.app`).

Untuk membuka di **Android Studio** atau membuat file **APK**:
```bash
cd frontend

# Sinkronisasi aset terbaru ke Android native project
npm run cap:sync

# Buka langsung di Android Studio
npx cap open android
```

> **Untuk Generate File APK (.apk):**
> 1. Jalankan `npx cap open android` untuk membuka proyek di Android Studio.
> 2. Di Android Studio, pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
> 3. File APK siap dibagikan dan di-install di HP Android Anda atau teman kelompok!

---

## 📄 Lisensi
Dibuat untuk kebutuhan kolaborasi dan manajemen tugas kelompok mahasiswa.
