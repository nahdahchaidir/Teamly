import os
import json
import re
from datetime import date

async def ask_ai(prompt: str) -> str:
    """Use Gemini when configured; otherwise return a useful deterministic fallback."""
    key = os.getenv('GEMINI_API_KEY')
    if key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain_core.messages import HumanMessage, SystemMessage
            model = ChatGoogleGenerativeAI(model=os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'), google_api_key=key, temperature=0.2)
            result = await model.ainvoke([SystemMessage(content='You are TeamPilot AI, a practical Agile project coach for student software projects. Use only supplied project data. Be concise, specific, and actionable.'), HumanMessage(content=prompt)])
            return str(result.content)
        except Exception as exc:
            return f'AI provider belum dapat digunakan ({type(exc).__name__}). Berikut analisis berbasis aturan: ' + fallback(prompt)
    return fallback(prompt)

def fallback(prompt: str) -> str:
    return ('Analisis awal TeamPilot AI untuk Proyek Tugas Kuliah:\n\n' +
      '1. Prioritaskan tugas berprioritas tinggi yang memiliki tenggat waktu terdekat.\n' +
      '2. Bagi beban kerja secara merata antar anggota kelompok berdasarkan keahlian masing-masing.\n' +
      '3. Buat wireframe atau skema database terlebih dahulu sebelum memulai coding.\n' +
      '4. Jangan lupa siapkan dokumentasi laporan dan pengujian sejak awal.\n\n' +
      'Rekomendasi: lakukan check-in singkat dengan teman sekelompok dan perbarui status tugas di papan Kanban.')

def project_prompt(project, tasks, members, question='Analyze this project'):
    today = date.today().isoformat()
    task_rows = '\n'.join([f"- {t.title}: status={t.status}, priority={t.priority}, deadline={t.deadline}, assignee_id={t.assignee_id}, estimate={t.estimated_hours}h" for t in tasks]) or 'No tasks'
    member_rows = '\n'.join([f'- {m.name} ({m.role}) id={m.id}' for m in members]) or 'No members'
    return f"Today: {today}\nProject: {project.name}\nDescription: {project.description}\nMembers:\n{member_rows}\nTasks:\n{task_rows}\nUser request: {question}\nGive findings, risks, and actionable next steps."

async def generate_project_idea(
    domain: str = 'kampus',
    course_topic: str = 'Pemrograman Web / RPL',
    member_count: int = 3,
    target_platform: str = 'Web App',
    difficulty: str = 'standard',
    problem: str = ''
) -> dict:
    """Generate 3 curated project concepts based on survey choices and decision-making criteria."""
    key = os.getenv('GEMINI_API_KEY')
    if key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain_core.messages import HumanMessage, SystemMessage
            model = ChatGoogleGenerativeAI(model=os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'), google_api_key=key, temperature=0.5)
            prompt = (
                f"Kamu adalah dosen pembimbing senior dan arsitek software untuk proyek tugas kuliah mahasiswa.\n"
                f"Mahasiswa bingung ingin membuat apa, dan telah mengisi survei preferensi berikut:\n"
                f"- Bidang Minat: {domain}\n"
                f"- Mata Kuliah / Topik: {course_topic}\n"
                f"- Jumlah Anggota: {member_count} orang\n"
                f"- Platform Pilihan: {target_platform}\n"
                f"- Tingkat Kesulitan: {difficulty}\n"
                f"{f'- Catatan Khusus: {problem}' if problem else ''}\n\n"
                f"Buatkan TEPAT 3 PILIHAN ide proyek kuliah yang siap dieksekusi mahasiswa dalam format JSON VALID murni:\n"
                f"{{\n"
                f'  "ideas": [\n'
                f'    {{\n'
                f'      "id": "idea-1",\n'
                f'      "name": "Nama Proyek Menarik",\n'
                f'      "tagline": "Satu kalimat singkat pemikat",\n'
                f'      "description": "Deskripsi solusi jelas 1-2 kalimat",\n'
                f'      "category": "{domain}",\n'
                f'      "difficulty": "Standar Nilai A",\n'
                f'      "target_platform": "{target_platform}",\n'
                f'      "banner_theme": "blue_campus",\n'
                f'      "tech_stack": ["Teknologi 1", "Teknologi 2", "Teknologi 3"],\n'
                f'      "features": ["Fitur 1", "Fitur 2", "Fitur 3", "Fitur 4"],\n'
                f'      "tasks": [\n'
                f'        {{"title": "Nama tugas", "description": "Detail", "priority": "high", "estimated_hours": 6, "role": "Peran"}}\n'
                f'      ],\n'
                f'      "roles": ["Peran 1", "Peran 2", "Peran 3"]\n'
                f'    }}\n'
                f'  ]\n'
                f"}}\n"
                f"Ketentuan: tasks minimal 5 tugas sprint awal per ide, roles tepat {member_count} nama peran. banner_theme salah satu dari: 'blue_campus', 'purple_cooking', 'peach_reading', 'emerald_eco', 'amber_pos'."
            )
            res = await model.ainvoke([SystemMessage(content='You are an academic software advisor. Always output raw valid JSON only.'), HumanMessage(content=prompt)])
            text = str(res.content).strip()
            text = re.sub(r'^```json\s*', '', text)
            text = re.sub(r'^```\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            data = json.loads(text)
            if 'ideas' in data and len(data['ideas']) > 0:
                return data
        except Exception:
            pass

    return fallback_survey_ideas(domain, course_topic, member_count, target_platform, difficulty)

def fallback_survey_ideas(domain: str, course_topic: str, member_count: int, target_platform: str, difficulty: str) -> dict:
    # Role presets based on team size
    role_presets = [
        ['Project Lead & Fullstack Developer'],
        ['Project Lead & Frontend Developer', 'Backend & Database Engineer'],
        ['UI/UX Designer & Frontend', 'Backend & Database Engineer', 'QA Tester & Dokumentasi'],
        ['Project Manager & UI/UX', 'Frontend Developer', 'Backend & Database Engineer', 'QA & Technical Writer'],
        ['Project Lead', 'UI/UX Designer', 'Frontend Developer', 'Backend Developer', 'QA & Technical Writer']
    ]
    r_idx = max(0, min(member_count - 1, 4))
    roles = role_presets[r_idx]

    def make_tasks(role_list, p_name):
        return [
            {
                'title': f'Rancang Wireframe & Alur Antarmuka {p_name}',
                'description': 'Desain mockup halaman utama dan komponen interaksi pengguna di Figma.',
                'priority': 'high',
                'estimated_hours': 6,
                'role': role_list[0]
            },
            {
                'title': 'Rancang Skema Basis Data (ERD) & Struktur Tabel',
                'description': 'Definisikan tabel, relasi foreign key, dan skema database relasional.',
                'priority': 'high',
                'estimated_hours': 6,
                'role': role_list[1] if len(role_list) > 1 else role_list[0]
            },
            {
                'title': 'Bangun REST API Autentikasi & CRUD Data Utama',
                'description': 'Implementasi endpoint backend dan alur logika bisnis inti.',
                'priority': 'high',
                'estimated_hours': 10,
                'role': role_list[1] if len(role_list) > 1 else role_list[0]
            },
            {
                'title': 'Integrasi Antarmuka Frontend dengan Endpoint Backend',
                'description': 'Hubungkan UI dengan API backend secara responsif dan tangani error handling.',
                'priority': 'medium',
                'estimated_hours': 8,
                'role': role_list[0] if len(role_list) <= 2 else role_list[min(2, len(role_list)-1)]
            },
            {
                'title': 'Pengujian Sistem & Penyusunan Laporan Proyek',
                'description': 'Uji seluruh fitur bebas bug dan siapkan dokumen laporan tugas kuliah.',
                'priority': 'medium',
                'estimated_hours': 6,
                'role': role_list[-1]
            }
        ]

    # Curate 3 tailored ideas based on selected domain
    ideas = []

    if domain == 'kampus':
        ideas = [
            {
                'id': 'idea-kampus-1',
                'name': 'KantinGo — Pre-Order & Antrean Digital Kantin Kampus',
                'tagline': 'Bebas antre saat jam istirahat kuliah',
                'description': 'Sistem pemesanan makanan kantin kampus dengan estimasi waktu ambil dan nomor antrean digital terintegrasi.',
                'category': 'Kampus & Akademik',
                'difficulty': 'Standar Nilai A (Rekomendasi Utama)',
                'target_platform': target_platform,
                'banner_theme': 'blue_campus',
                'tech_stack': ['React.js', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
                'features': [
                    'Katalog menu makanan & status ketersediaan porsi real-time',
                    'Pre-order dengan estimasi waktu penyiapan & nomor antrean',
                    'Dashboard merchant kantin untuk memproses pesanan masuk',
                    'Notifikasi pesanan siap diambil via web/mobile'
                ],
                'tasks': make_tasks(roles, 'KantinGo'),
                'roles': roles
            },
            {
                'id': 'idea-kampus-2',
                'name': 'LabTrack — Inventaris & Peminjaman Alat Laboratorium',
                'tagline': 'Tracking peminjaman alat praktikum anti-hilang',
                'description': 'Aplikasi pengelolaan peminjaman fasilitas laboratorium kampus dengan verifikasi QR code dan denda keterlambatan.',
                'category': 'Kampus & Akademik',
                'difficulty': 'Praktis & Fokus Fitur Inti',
                'target_platform': target_platform,
                'banner_theme': 'peach_reading',
                'tech_stack': ['Vue.js / React', 'FastAPI', 'SQLite', 'QR Code Scanner'],
                'features': [
                    'Katalog inventaris alat laboratorium beserta kondisinya',
                    'Form peminjaman online dengan approval laboran',
                    'Scan QR code saat serah terima & pengembalian',
                    'Log riwayat peminjaman dan pelaporan kerusakan'
                ],
                'tasks': make_tasks(roles, 'LabTrack'),
                'roles': roles
            },
            {
                'id': 'idea-kampus-3',
                'name': 'SiBimbingan — Penjadwalan & Catatan Revisi Skripsi',
                'tagline': 'Bimbingan tugas akhir lebih rapi dan terjadwal',
                'description': 'Platform sinkronisasi jadwal bimbingan dosen dan mahasiswa lengkap dengan riwayat revisi berkas naskah.',
                'category': 'Kampus & Akademik',
                'difficulty': 'Lengkap & Nilai Portofolio',
                'target_platform': target_platform,
                'banner_theme': 'purple_cooking',
                'tech_stack': ['Next.js', 'FastAPI', 'FullCalendar', 'PostgreSQL'],
                'features': [
                    'Kalender ketersediaan sesi bimbingan dosen',
                    'Booking slot bimbingan dengan topik bahasan per bab',
                    'Upload draft berkas naskah PDF & log revisi',
                    'Rekapitulasi jumlah bimbingan untuk syarat ujian sidang'
                ],
                'tasks': make_tasks(roles, 'SiBimbingan'),
                'roles': roles
            }
        ]
    elif domain == 'bisnis':
        ideas = [
            {
                'id': 'idea-bisnis-1',
                'name': 'KasirPintar — Point of Sale (POS) & Inventaris UMKM',
                'tagline': 'Kasir digital cepat & pencatatan stok otomatis',
                'description': 'Aplikasi kasir ringan untuk UMKM lokal dengan perhitungan laba rugi instan dan peringatan stok menipis.',
                'category': 'Bisnis & UMKM',
                'difficulty': 'Standar Nilai A (Rekomendasi Utama)',
                'target_platform': target_platform,
                'banner_theme': 'amber_pos',
                'tech_stack': ['React.js', 'FastAPI', 'Tailwind CSS', 'PostgreSQL'],
                'features': [
                    'Antarmuka kasir cepat dengan barcode / pencarian instan',
                    'Pencatatan stok otomatis berkurang setiap transaksi',
                    'Cetak struk belanja digital & ringkasan penjualan harian',
                    'Peringatan otomatis saat stok barang mendekati batas minimum'
                ],
                'tasks': make_tasks(roles, 'KasirPintar'),
                'roles': roles
            },
            {
                'id': 'idea-bisnis-2',
                'name': 'KatalogKu — Pemesanan Menu & Toko Online Lokal',
                'tagline': 'Etalase produk digital langsung ke WhatsApp',
                'description': 'Website katalog interaktif untuk bisnis kuliner atau toko pakaian dengan integrasi pesan otomatis ke WhatsApp penjual.',
                'category': 'Bisnis & UMKM',
                'difficulty': 'Praktis & Cepat Jadi',
                'target_platform': target_platform,
                'banner_theme': 'purple_cooking',
                'tech_stack': ['Next.js', 'Tailwind CSS', 'FastAPI', 'WhatsApp API'],
                'features': [
                    'Katalog produk responsif dengan varian warna dan ukuran',
                    'Keranjang belanja lokal tanpa perlu login rumit',
                    'Format pesan pesanan rapi otomatis ke WhatsApp penjual',
                    'Panel admin untuk update harga dan stok produk'
                ],
                'tasks': make_tasks(roles, 'KatalogKu'),
                'roles': roles
            },
            {
                'id': 'idea-bisnis-3',
                'name': 'GudangPro — Manajemen Inventaris Multi-Lokasi',
                'tagline': 'Pelacakan stok keluar-masuk akurat dan rapi',
                'description': 'Sistem supply chain sederhana untuk mencatat perpindahan barang, supplier, dan laporan valuasi aset gudang.',
                'category': 'Bisnis & UMKM',
                'difficulty': 'Lengkap & Nilai Portofolio',
                'target_platform': target_platform,
                'banner_theme': 'blue_campus',
                'tech_stack': ['React.js', 'FastAPI', 'PostgreSQL', 'Chart.js'],
                'features': [
                    'Pencatatan barang masuk dari supplier (Purchase Order)',
                    'Surat jalan & pencatatan barang keluar',
                    'Pelacakan nomor batch dan tanggal kadaluarsa',
                    'Laporan valuasi aset gudang periodik (PDF/Excel)'
                ],
                'tasks': make_tasks(roles, 'GudangPro'),
                'roles': roles
            }
        ]
    elif domain == 'lingkungan':
        ideas = [
            {
                'id': 'idea-lingk-1',
                'name': 'EcoCampus — Bank Sampah & Reward Daur Ulang',
                'tagline': 'Tukar botol dan kertas bekas jadi poin reward',
                'description': 'Platform insentif penukaran sampah anorganik kampus dengan poin digital yang bisa ditukar voucher kantin.',
                'category': 'Lingkungan & Sosial',
                'difficulty': 'Standar Nilai A (Rekomendasi Utama)',
                'target_platform': target_platform,
                'banner_theme': 'emerald_eco',
                'tech_stack': ['React.js', 'FastAPI', 'Tailwind CSS', 'PostgreSQL'],
                'features': [
                    'Katalog jenis sampah yang diterima beserta harga poin per kg',
                    'Pencatatan timbangan sampah oleh petugas bank sampah',
                    'Dompet poin reward mahasiswa & penukaran voucher',
                    'Statistik total kilogram sampah yang berhasil didaur ulang'
                ],
                'tasks': make_tasks(roles, 'EcoCampus'),
                'roles': roles
            },
            {
                'id': 'idea-lingk-2',
                'name': 'FoodShare — Penyaluran Makanan Berlebih Ramah Lingkungan',
                'tagline': 'Cegah food waste dengan berbagi makanan layak',
                'description': 'Aplikasi penghubung antara restoran/acara katering yang memiliki makanan berlebih dengan komunitas yang membutuhkan.',
                'category': 'Lingkungan & Sosial',
                'difficulty': 'Praktis & Dampak Nyata',
                'target_platform': target_platform,
                'banner_theme': 'purple_cooking',
                'tech_stack': ['React.js', 'FastAPI', 'Leaflet Map', 'PostgreSQL'],
                'features': [
                    'Posting donasi makanan berlebih dengan foto & batas aman konsumsi',
                    'Peta lokasi pengambilan makanan terdekat (Geolocation)',
                    'Konfirmasi klaim makanan oleh relawan / panti asuhan',
                    'Laporan metrik porsi makanan yang terselamatkan'
                ],
                'tasks': make_tasks(roles, 'FoodShare'),
                'roles': roles
            },
            {
                'id': 'idea-lingk-3',
                'name': 'GreenHabit — Tracker Jejak Karbon Mahasiswa',
                'tagline': 'Ukur dan kurangi emisi harian secara seru',
                'description': 'Aplikasi gamifikasi kebiasaan ramah lingkungan seperti jalan kaki, naik sepeda, atau membawa tumbler.',
                'category': 'Lingkungan & Sosial',
                'difficulty': 'Lengkap & Nilai Portofolio',
                'target_platform': target_platform,
                'banner_theme': 'emerald_eco',
                'tech_stack': ['React.js', 'FastAPI', 'Chart.js', 'PostgreSQL'],
                'features': [
                    'Kalkulator estimasi emisi karbon harian (transportasi, listrik)',
                    'Tantangan mingguan gaya hidup hijau (Green Challenge)',
                    'Papan peringkat (leaderboard) mahasiswa paling ramah lingkungan',
                    'Badge prestasi pencapaian reduksi karbon'
                ],
                'tasks': make_tasks(roles, 'GreenHabit'),
                'roles': roles
            }
        ]
    elif domain == 'lifestyle':
        ideas = [
            {
                'id': 'idea-life-1',
                'name': 'FitTrack — Kebiasaan Hidup Sehat & Rutinitas Olahraga',
                'tagline': 'Pantau workout, kalori, dan konsistensi harian',
                'description': 'Aplikasi pelacak kebiasaan olahraga harian dengan visualisasi progres visual yang memotivasi mahasiswa.',
                'category': 'Kesehatan & Gaya Hidup',
                'difficulty': 'Standar Nilai A (Rekomendasi Utama)',
                'target_platform': target_platform,
                'banner_theme': 'blue_campus',
                'tech_stack': ['React.js', 'FastAPI', 'Tailwind CSS', 'SQLite'],
                'features': [
                    'Log aktivitas olahraga (jogging, gym, calisthenics) dengan durasi',
                    'Pencatatan target konsumsi air putih dan jam tidur harian',
                    'Grafik streak konsistensi dan persentase aktivitas selesai',
                    'Pengingat waktu olahraga harian otomatis'
                ],
                'tasks': make_tasks(roles, 'FitTrack'),
                'roles': roles
            },
            {
                'id': 'idea-life-2',
                'name': 'DapurMahasiswa — Resep Hemat Sesuai Bahan di Kulkas',
                'tagline': 'Masak enak dan bergizi dengan anggaran anak kos',
                'description': 'Aplikasi pencari resep praktis dengan input bahan makanan yang tersedia di kos untuk menghemat pengeluaran makan.',
                'category': 'Kesehatan & Gaya Hidup',
                'difficulty': 'Praktis & Sangat Relevan',
                'target_platform': target_platform,
                'banner_theme': 'purple_cooking',
                'tech_stack': ['Next.js', 'FastAPI', 'PostgreSQL', 'Tailwind'],
                'features': [
                    'Pencarian resep berdasarkan bahan makanan yang dimiliki',
                    'Estimasi biaya memasak per porsi hemat anak kos',
                    'Langkah memasak bertahap dengan timer masak',
                    'Fitur simpan menu favorit dan jadwal masak mingguan'
                ],
                'tasks': make_tasks(roles, 'DapurMahasiswa'),
                'roles': roles
            },
            {
                'id': 'idea-life-3',
                'name': 'MindSpace — Mood Tracker & Journaling Mahasiswa',
                'tagline': 'Kesehatan mental dan refleksi diri di tengah kuliah',
                'description': 'Platform pencatatan emosi harian, jurnal syukur pribadi, dan teknik relaksasi pernapasan untuk mengurangi stres kuliah.',
                'category': 'Kesehatan & Gaya Hidup',
                'difficulty': 'Lengkap & Nilai Portofolio',
                'target_platform': target_platform,
                'banner_theme': 'peach_reading',
                'tech_stack': ['React.js', 'FastAPI', 'Chart.js', 'PostgreSQL'],
                'features': [
                    'Pencatatan mood harian dengan emoji dan catatan singkat',
                    'Jurnal refleksi pribadi dengan enkripsi data aman',
                    'Panduan audio latihan pernapasan (Box Breathing) 2 menit',
                    'Grafik tren kesehatan mental bulanan'
                ],
                'tasks': make_tasks(roles, 'MindSpace'),
                'roles': roles
            }
        ]
    elif domain == 'organisasi':
        ideas = [
            {
                'id': 'idea-org-1',
                'name': 'KasKu — Manajemen Kas & Transparansi Iuran Mahasiswa',
                'tagline': 'Pencatatan iuran transparan & bebas curiga',
                'description': 'Platform pencatatan iuran kas organisasi mahasiswa dengan bukti transfer digital terverifikasi dan laporan saldo otomatis.',
                'category': 'Organisasi & Komunitas',
                'difficulty': 'Standar Nilai A (Rekomendasi Utama)',
                'target_platform': target_platform,
                'banner_theme': 'amber_pos',
                'tech_stack': ['React.js', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
                'features': [
                    'Pencatatan tagihan iuran rutin dengan status lunas per anggota',
                    'Upload dan verifikasi bukti transfer pembayaran kas',
                    'Pencatatan pengeluaran dana kas lengkap dengan nota digital',
                    'Laporan arus kas otomatis yang dapat diunduh (PDF / Excel)'
                ],
                'tasks': make_tasks(roles, 'KasKu'),
                'roles': roles
            },
            {
                'id': 'idea-org-2',
                'name': 'EventKampus — Manajemen Kepanitiaan & Presensi QR',
                'tagline': 'Kelola seminar & lomba kampus dengan tiket QR',
                'description': 'Sistem pendaftaran acara kampus, pembagian tugas panitia, dan presensi kehadiran cepat menggunakan scan QR code.',
                'category': 'Organisasi & Komunitas',
                'difficulty': 'Praktis & Solutif',
                'target_platform': target_platform,
                'banner_theme': 'blue_campus',
                'tech_stack': ['Next.js', 'FastAPI', 'QR Code Generator', 'PostgreSQL'],
                'features': [
                    'Halaman pendaftaran peserta acara dengan e-tiket QR code',
                    'Scan tiket masuk cepat di pintu registrasi oleh panitia',
                    'Pembagian divisi kepanitiaan dan timeline tugas',
                    'Rekapitulasi daftar hadir dan sertifikat digital otomatis'
                ],
                'tasks': make_tasks(roles, 'EventKampus'),
                'roles': roles
            },
            {
                'id': 'idea-org-3',
                'name': 'SuaraMahasiswa — E-Voting Pemilihan Ketua Himpunan',
                'tagline': 'Pemilu mahasiswa jujur, adil, dan transparan',
                'description': 'Sistem pemilihan suara elektronik dengan verifikasi NIM mahasiswa dan penghitungan suara cepat (Quick Count).',
                'category': 'Organisasi & Komunitas',
                'difficulty': 'Lengkap & Nilai Portofolio',
                'target_platform': target_platform,
                'banner_theme': 'peach_reading',
                'tech_stack': ['React.js', 'FastAPI', 'Chart.js', 'PostgreSQL'],
                'features': [
                    'Profil lengkap kandidat calon ketua beserta visi dan misi',
                    'Verifikasi hak suara mahasiswa dengan token sekali pakai (OTP)',
                    'Bilik suara digital dengan konfirmasi pilihan yang aman',
                    'Live count grafik perolehan suara yang transparan'
                ],
                'tasks': make_tasks(roles, 'SuaraMahasiswa'),
                'roles': roles
            }
        ]
    else: # produktivitas & belajar
        ideas = [
            {
                'id': 'idea-prod-1',
                'name': 'StudySync — Manajemen Tugas Kuliah & Study Tracker Tim',
                'tagline': 'Bagi tugas kelompok dan pantau deadline tanpa panik',
                'description': 'Aplikasi kolaborasi belajar mahasiswa untuk membagi tugas kelompok, melacak deadline ujian, dan berbagi catatan kuliah.',
                'category': 'Produktivitas & Belajar',
                'difficulty': 'Standar Nilai A (Rekomendasi Utama)',
                'target_platform': target_platform,
                'banner_theme': 'peach_reading',
                'tech_stack': ['React.js', 'FastAPI', 'Tailwind CSS', 'PostgreSQL'],
                'features': [
                    'Kalender jadwal kuliah & deadline tugas terintegrasi',
                    'Papan Kanban pembagian tugas kelompok mata kuliah',
                    'Ruang berbagi ringkasan materi & file catatan kuliah',
                    'Notifikasi pengingat otomatis menjelang deadline'
                ],
                'tasks': make_tasks(roles, 'StudySync'),
                'roles': roles
            },
            {
                'id': 'idea-prod-2',
                'name': 'PomoTeam — Pomodoro Timer & Fokus Belajar Kelompok',
                'tagline': 'Belajar fokus bareng teman kelompok secara sinkron',
                'description': 'Aplikasi timer belajar pomodoro bersama dengan musik lofi pengiring dan statistik waktu produktif harian.',
                'category': 'Produktivitas & Belajar',
                'difficulty': 'Praktis & Menarik',
                'target_platform': target_platform,
                'banner_theme': 'purple_cooking',
                'tech_stack': ['React.js', 'WebSockets', 'Tailwind CSS', 'SQLite'],
                'features': [
                    'Room belajar kelompok dengan timer pomodoro tersinkronisasi',
                    'Pemutar audio lofi / ambient sound penambah fokus',
                    'To-do list harian yang dapat dicentang saat sesi fokus',
                    'Statistik total jam belajar per mahasiswa'
                ],
                'tasks': make_tasks(roles, 'PomoTeam'),
                'roles': roles
            },
            {
                'id': 'idea-prod-3',
                'name': 'FlashCardHub — Kartu Belajar Pintar & Kuis Spaced Repetition',
                'tagline': 'Hafal materi ujian lebih cepat dan tahan lama',
                'description': 'Platform pembuatan kartu flashcard materi kuliah dengan algoritma pengulangan berjarak (Spaced Repetition) untuk persiapan ujian.',
                'category': 'Produktivitas & Belajar',
                'difficulty': 'Lengkap & Nilai Portofolio',
                'target_platform': target_platform,
                'banner_theme': 'blue_campus',
                'tech_stack': ['Next.js', 'FastAPI', 'PostgreSQL', 'Tailwind'],
                'features': [
                    'Pembuatan deck flashcard per mata kuliah (tanya & jawab)',
                    'Mode kuis latihan mandiri dengan algoritma spaced repetition',
                    'Berbagi deck materi dengan teman sekelas',
                    'Statistik tingkat penguasaan materi per topik'
                ],
                'tasks': make_tasks(roles, 'FlashCardHub'),
                'roles': roles
            }
        ]

    return {'ideas': ideas}
