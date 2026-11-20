import api from './api';

export async function generateProjectIdea({
  domain = 'kampus',
  courseTopic = 'Pemrograman Web / RPL',
  memberCount = 3,
  platform = 'Web App',
  difficulty = 'standard',
  problem = ''
}) {
  const mCount = Number(memberCount) || 3;

  // 1. Try backend API first
  try {
    const res = await api.post('/ai/generate-project-idea', {
      domain,
      course_topic: courseTopic,
      member_count: mCount,
      target_platform: platform,
      difficulty,
      problem
    });
    if (res.data && res.data.ideas && res.data.ideas.length > 0) {
      return res.data;
    }
  } catch {
    // If backend is offline or returns error, proceed to local generator
  }

  // 2. Client-side generator fallback (instant, beautiful & 100% reliable)
  return localGenerateSurveyIdeas(domain, courseTopic, mCount, platform, difficulty);
}

export function localGenerateSurveyIdeas(domain, courseTopic, memberCount, platform, difficulty) {
  // Role presets based on team size
  const rolePresets = [
    ['Project Lead & Fullstack Developer'],
    ['Project Lead & Frontend Developer', 'Backend & Database Engineer'],
    ['UI/UX Designer & Frontend', 'Backend & Database Engineer', 'QA Tester & Dokumentasi'],
    ['Project Manager & UI/UX', 'Frontend Developer', 'Backend & Database Engineer', 'QA & Technical Writer'],
    ['Project Lead', 'UI/UX Designer', 'Frontend Developer', 'Backend Developer', 'QA & Technical Writer']
  ];
  const rIdx = Math.max(0, Math.min(memberCount - 1, 4));
  const roles = rolePresets[rIdx];

  const makeTasks = (pName) => [
    {
      title: `Rancang Wireframe & Alur UI/UX ${pName}`,
      description: 'Mockup antarmuka interaktif fitur utama dan alur navigasi di Figma.',
      priority: 'high',
      estimated_hours: 6,
      role: roles[0]
    },
    {
      title: 'Rancang Skema Basis Data (ERD) & Relasi Tabel',
      description: 'Definisikan struktur entitas data, kunci foreign key, dan skema database relasional.',
      priority: 'high',
      estimated_hours: 6,
      role: roles[1] || roles[0]
    },
    {
      title: 'Implementasi REST API & CRUD Fitur Utama',
      description: 'Bangun endpoint backend untuk menangani autentikasi dan logika bisnis inti.',
      priority: 'high',
      estimated_hours: 10,
      role: roles[1] || roles[0]
    },
    {
      title: 'Integrasi Antarmuka Frontend dengan Endpoint API',
      description: 'Hubungkan tampilan web/mobile dengan backend API secara responsif dan tangani state.',
      priority: 'medium',
      estimated_hours: 8,
      role: roles[roles.length > 2 ? 0 : 0]
    },
    {
      title: 'Pengujian Sistem & Penyusunan Laporan Proyek',
      description: 'Uji fungsionalitas bebas error dan siapkan dokumen bab laporan tugas kuliah.',
      priority: 'medium',
      estimated_hours: 6,
      role: roles[roles.length - 1]
    }
  ];

  const domainCatalog = {
    kampus: [
      {
        id: 'kampus-1',
        name: 'KantinGo — Pre-Order & Antrean Digital Kantin Kampus',
        tagline: 'Pesan makanan tanpa antre saat jam istirahat kuliah',
        description: 'Sistem pemesanan makanan kantin kampus dengan estimasi waktu ambil dan nomor antrean digital terintegrasi.',
        category: 'Kampus & Akademik',
        difficulty: 'Standar Nilai A (Rekomendasi Utama)',
        target_platform: platform,
        banner_theme: 'blue_campus',
        tech_stack: ['React.js', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
        features: [
          'Katalog menu kantin & ketersediaan porsi real-time',
          'Pre-order dengan estimasi waktu penyiapan & nomor antrean',
          'Dashboard penjual untuk memproses pesanan masuk',
          'Notifikasi pesanan siap diambil via web/mobile'
        ],
        tasks: makeTasks('KantinGo'),
        roles
      },
      {
        id: 'kampus-2',
        name: 'LabTrack — Inventaris & Peminjaman Alat Laboratorium',
        tagline: 'Kelola peminjaman fasilitas praktikum kampus anti-hilang',
        description: 'Aplikasi pengelolaan peminjaman fasilitas laboratorium kampus dengan verifikasi QR code dan denda keterlambatan.',
        category: 'Kampus & Akademik',
        difficulty: 'Praktis & Fokus Fitur Inti',
        target_platform: platform,
        banner_theme: 'peach_reading',
        tech_stack: ['Vue.js / React', 'FastAPI', 'SQLite', 'QR Code Scanner'],
        features: [
          'Katalog inventaris alat laboratorium beserta kondisinya',
          'Form peminjaman online dengan approval petugas laboran',
          'Scan QR code saat serah terima & pengembalian alat',
          'Log riwayat peminjaman dan pelaporan kerusakan fasilitas'
        ],
        tasks: makeTasks('LabTrack'),
        roles
      },
      {
        id: 'kampus-3',
        name: 'SiBimbingan — Penjadwalan & Catatan Revisi Skripsi',
        tagline: 'Bimbingan tugas akhir lebih rapi dan terjadwal',
        description: 'Platform sinkronisasi jadwal bimbingan dosen dan mahasiswa lengkap dengan riwayat revisi berkas naskah.',
        category: 'Kampus & Akademik',
        difficulty: 'Lengkap & Nilai Portofolio',
        target_platform: platform,
        banner_theme: 'purple_cooking',
        tech_stack: ['Next.js', 'FastAPI', 'FullCalendar', 'PostgreSQL'],
        features: [
          'Kalender ketersediaan sesi bimbingan dosen per minggu',
          'Booking slot bimbingan dengan topik bahasan per bab',
          'Upload draft berkas naskah PDF & log catatan revisi',
          'Rekapitulasi jumlah bimbingan untuk syarat ujian sidang'
        ],
        tasks: makeTasks('SiBimbingan'),
        roles
      }
    ],

    bisnis: [
      {
        id: 'bisnis-1',
        name: 'KasirPintar — Point of Sale (POS) & Inventaris Toko UMKM',
        tagline: 'Kasir digital cepat & pencatatan stok otomatis berkurang',
        description: 'Aplikasi kasir ringan untuk UMKM lokal dengan perhitungan laba rugi instan dan peringatan stok menipis.',
        category: 'Bisnis & UMKM',
        difficulty: 'Standar Nilai A (Rekomendasi Utama)',
        target_platform: platform,
        banner_theme: 'amber_pos',
        tech_stack: ['React.js', 'FastAPI', 'Tailwind CSS', 'PostgreSQL'],
        features: [
          'Antarmuka kasir cepat dengan barcode / pencarian instan',
          'Pencatatan stok otomatis berkurang setiap transaksi',
          'Cetak struk belanja digital & ringkasan penjualan harian',
          'Peringatan otomatis saat stok barang mendekati batas minimum'
        ],
        tasks: makeTasks('KasirPintar'),
        roles
      },
      {
        id: 'bisnis-2',
        name: 'KatalogKu — Pemesanan Menu & Toko Online Lokal',
        tagline: 'Etalase produk digital langsung terhubung ke WhatsApp',
        description: 'Website katalog interaktif untuk bisnis kuliner atau toko pakaian dengan integrasi pesan otomatis ke WhatsApp penjual.',
        category: 'Bisnis & UMKM',
        difficulty: 'Praktis & Cepat Selesai',
        target_platform: platform,
        banner_theme: 'purple_cooking',
        tech_stack: ['Next.js', 'Tailwind CSS', 'FastAPI', 'WhatsApp API'],
        features: [
          'Katalog produk responsif dengan varian warna dan ukuran',
          'Keranjang belanja lokal tanpa perlu login berbelit-belit',
          'Format pesan pesanan rapi otomatis ke WhatsApp penjual',
          'Panel admin untuk update harga dan status ketersediaan'
        ],
        tasks: makeTasks('KatalogKu'),
        roles
      },
      {
        id: 'bisnis-3',
        name: 'GudangPro — Manajemen Inventaris Multi-Lokasi',
        tagline: 'Pelacakan stok keluar-masuk akurat dan rapi',
        description: 'Sistem supply chain sederhana untuk mencatat perpindahan barang, supplier, dan laporan valuasi aset gudang.',
        category: 'Bisnis & UMKM',
        difficulty: 'Lengkap & Nilai Portofolio',
        target_platform: platform,
        banner_theme: 'blue_campus',
        tech_stack: ['React.js', 'FastAPI', 'PostgreSQL', 'Chart.js'],
        features: [
          'Pencatatan barang masuk dari supplier (Purchase Order)',
          'Surat jalan & pencatatan barang keluar',
          'Pelacakan nomor batch dan tanggal kadaluarsa',
          'Laporan valuasi aset gudang periodik (PDF/Excel)'
        ],
        tasks: makeTasks('GudangPro'),
        roles
      }
    ],

    lingkungan: [
      {
        id: 'lingk-1',
        name: 'EcoCampus — Bank Sampah & Reward Daur Ulang',
        tagline: 'Tukar botol dan kertas bekas jadi poin reward belanja',
        description: 'Platform insentif penukaran sampah anorganik kampus dengan poin digital yang bisa ditukar voucher kantin.',
        category: 'Lingkungan & Sosial',
        difficulty: 'Standar Nilai A (Rekomendasi Utama)',
        target_platform: platform,
        banner_theme: 'emerald_eco',
        tech_stack: ['React.js', 'FastAPI', 'Tailwind CSS', 'PostgreSQL'],
        features: [
          'Katalog jenis sampah yang diterima beserta harga poin per kg',
          'Pencatatan timbangan sampah oleh petugas bank sampah',
          'Dompet poin reward mahasiswa & penukaran voucher',
          'Statistik total kilogram sampah yang berhasil didaur ulang'
        ],
        tasks: makeTasks('EcoCampus'),
        roles
      },
      {
        id: 'lingk-2',
        name: 'FoodShare — Penyaluran Makanan Berlebih Ramah Lingkungan',
        tagline: 'Cegah food waste dengan berbagi makanan layak konsumsi',
        description: 'Aplikasi penghubung antara restoran/acara katering yang memiliki makanan berlebih dengan komunitas yang membutuhkan.',
        category: 'Lingkungan & Sosial',
        difficulty: 'Praktis & Dampak Nyata',
        target_platform: platform,
        banner_theme: 'purple_cooking',
        tech_stack: ['React.js', 'FastAPI', 'Leaflet Map', 'PostgreSQL'],
        features: [
          'Posting donasi makanan berlebih dengan foto & batas aman konsumsi',
          'Peta lokasi pengambilan makanan terdekat (Geolocation)',
          'Konfirmasi klaim makanan oleh relawan / panti asuhan',
          'Laporan metrik porsi makanan yang terselamatkan'
        ],
        tasks: makeTasks('FoodShare'),
        roles
      },
      {
        id: 'lingk-3',
        name: 'GreenHabit — Tracker Jejak Karbon Mahasiswa',
        tagline: 'Ukur dan kurangi emisi harian secara seru dan gamified',
        description: 'Aplikasi gamifikasi kebiasaan ramah lingkungan seperti jalan kaki, naik sepeda, atau membawa tumbler.',
        category: 'Lingkungan & Sosial',
        difficulty: 'Lengkap & Nilai Portofolio',
        target_platform: platform,
        banner_theme: 'emerald_eco',
        tech_stack: ['React.js', 'FastAPI', 'Chart.js', 'PostgreSQL'],
        features: [
          'Kalkulator estimasi emisi karbon harian (transportasi, listrik)',
          'Tantangan mingguan gaya hidup hijau (Green Challenge)',
          'Papan peringkat (leaderboard) mahasiswa paling ramah lingkungan',
          'Badge prestasi pencapaian reduksi karbon'
        ],
        tasks: makeTasks('GreenHabit'),
        roles
      }
    ],

    lifestyle: [
      {
        id: 'life-1',
        name: 'FitTrack — Kebiasaan Hidup Sehat & Rutinitas Olahraga',
        tagline: 'Pantau workout, hidrasi, dan konsistensi harian mahasiswa',
        description: 'Aplikasi pelacak kebiasaan olahraga harian dengan visualisasi progres visual yang memotivasi mahasiswa.',
        category: 'Kesehatan & Gaya Hidup',
        difficulty: 'Standar Nilai A (Rekomendasi Utama)',
        target_platform: platform,
        banner_theme: 'blue_campus',
        tech_stack: ['React.js', 'FastAPI', 'Tailwind CSS', 'SQLite'],
        features: [
          'Log aktivitas olahraga (jogging, gym, calisthenics) dengan durasi',
          'Pencatatan target konsumsi air putih dan jam tidur harian',
          'Grafik streak konsistensi dan persentase aktivitas selesai',
          'Pengingat waktu olahraga harian otomatis'
        ],
        tasks: makeTasks('FitTrack'),
        roles
      },
      {
        id: 'life-2',
        name: 'DapurMahasiswa — Resep Hemat Sesuai Bahan di Kulkas',
        tagline: 'Masak enak dan bergizi dengan anggaran anak kos',
        description: 'Aplikasi pencari resep praktis dengan input bahan makanan yang tersedia di kos untuk menghemat pengeluaran makan.',
        category: 'Kesehatan & Gaya Hidup',
        difficulty: 'Praktis & Sangat Relevan',
        target_platform: platform,
        banner_theme: 'purple_cooking',
        tech_stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Tailwind'],
        features: [
          'Pencarian resep berdasarkan bahan makanan yang dimiliki',
          'Estimasi biaya memasak per porsi hemat anak kos',
          'Langkah memasak bertahap dengan timer masak',
          'Fitur simpan menu favorit dan jadwal masak mingguan'
        ],
        tasks: makeTasks('DapurMahasiswa'),
        roles
      },
      {
        id: 'life-3',
        name: 'MindSpace — Mood Tracker & Journaling Mahasiswa',
        tagline: 'Kesehatan mental dan refleksi diri di tengah padatnya kuliah',
        description: 'Platform pencatatan emosi harian, jurnal syukur pribadi, dan teknik relaksasi pernapasan untuk mengurangi stres kuliah.',
        category: 'Kesehatan & Gaya Hidup',
        difficulty: 'Lengkap & Nilai Portofolio',
        target_platform: platform,
        banner_theme: 'peach_reading',
        tech_stack: ['React.js', 'FastAPI', 'Chart.js', 'PostgreSQL'],
        features: [
          'Pencatatan mood harian dengan emoji dan catatan singkat',
          'Jurnal refleksi pribadi dengan enkripsi data aman',
          'Panduan audio latihan pernapasan (Box Breathing) 2 menit',
          'Grafik tren kesehatan mental bulanan'
        ],
        tasks: makeTasks('MindSpace'),
        roles
      }
    ],

    organisasi: [
      {
        id: 'org-1',
        name: 'KasKu — Manajemen Kas & Transparansi Iuran Mahasiswa',
        tagline: 'Pencatatan iuran transparan & bebas saling curiga',
        description: 'Platform pencatatan iuran kas organisasi mahasiswa dengan bukti transfer digital terverifikasi dan laporan saldo otomatis.',
        category: 'Organisasi & Komunitas',
        difficulty: 'Standar Nilai A (Rekomendasi Utama)',
        target_platform: platform,
        banner_theme: 'amber_pos',
        tech_stack: ['React.js', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
        features: [
          'Pencatatan tagihan iuran rutin dengan status lunas per anggota',
          'Upload dan verifikasi bukti transfer pembayaran kas',
          'Pencatatan pengeluaran dana kas lengkap dengan nota digital',
          'Laporan arus kas otomatis yang dapat diunduh (PDF / Excel)'
        ],
        tasks: makeTasks('KasKu'),
        roles
      },
      {
        id: 'org-2',
        name: 'EventKampus — Manajemen Kepanitiaan & Presensi QR',
        tagline: 'Kelola seminar & lomba kampus dengan tiket QR instan',
        description: 'Sistem pendaftaran acara kampus, pembagian tugas panitia, dan presensi kehadiran cepat menggunakan scan QR code.',
        category: 'Organisasi & Komunitas',
        difficulty: 'Praktis & Solutif',
        target_platform: platform,
        banner_theme: 'blue_campus',
        tech_stack: ['Next.js', 'FastAPI', 'QR Code Generator', 'PostgreSQL'],
        features: [
          'Halaman pendaftaran peserta acara dengan e-tiket QR code',
          'Scan tiket masuk cepat di pintu registrasi oleh panitia',
          'Pembagian divisi kepanitiaan dan timeline tugas',
          'Rekapitulasi daftar hadir dan sertifikat digital otomatis'
        ],
        tasks: makeTasks('EventKampus'),
        roles
      },
      {
        id: 'org-3',
        name: 'SuaraMahasiswa — E-Voting Pemilihan Ketua Himpunan',
        tagline: 'Pemilu mahasiswa jujur, adil, dan transparan',
        description: 'Sistem pemilihan suara elektronik dengan verifikasi NIM mahasiswa dan penghitungan suara cepat (Quick Count).',
        category: 'Organisasi & Komunitas',
        difficulty: 'Lengkap & Nilai Portofolio',
        target_platform: platform,
        banner_theme: 'peach_reading',
        tech_stack: ['React.js', 'FastAPI', 'Chart.js', 'PostgreSQL'],
        features: [
          'Profil lengkap kandidat calon ketua beserta visi dan misi',
          'Verifikasi hak suara mahasiswa dengan token sekali pakai (OTP)',
          'Bilik suara digital dengan konfirmasi pilihan yang aman',
          'Live count grafik perolehan suara yang transparan'
        ],
        tasks: makeTasks('SuaraMahasiswa'),
        roles
      }
    ],

    produktivitas: [
      {
        id: 'prod-1',
        name: 'StudySync — Manajemen Tugas Kuliah & Study Tracker Tim',
        tagline: 'Bagi tugas kelompok dan pantau deadline tanpa panik',
        description: 'Aplikasi kolaborasi belajar mahasiswa untuk membagi tugas kelompok, melacak deadline ujian, dan berbagi catatan kuliah.',
        category: 'Produktivitas & Belajar',
        difficulty: 'Standar Nilai A (Rekomendasi Utama)',
        target_platform: platform,
        banner_theme: 'peach_reading',
        tech_stack: ['React.js', 'FastAPI', 'Tailwind CSS', 'PostgreSQL'],
        features: [
          'Kalender jadwal kuliah & deadline tugas terintegrasi',
          'Papan Kanban pembagian tugas kelompok mata kuliah',
          'Ruang berbagi ringkasan materi & file catatan kuliah',
          'Notifikasi pengingat otomatis menjelang deadline'
        ],
        tasks: makeTasks('StudySync'),
        roles
      },
      {
        id: 'prod-2',
        name: 'PomoTeam — Pomodoro Timer & Fokus Belajar Kelompok',
        tagline: 'Belajar fokus bareng teman kelompok secara tersinkron',
        description: 'Aplikasi timer belajar pomodoro bersama dengan musik lofi pengiring dan statistik waktu produktif harian.',
        category: 'Produktivitas & Belajar',
        difficulty: 'Praktis & Menarik',
        target_platform: platform,
        banner_theme: 'purple_cooking',
        tech_stack: ['React.js', 'WebSockets', 'Tailwind CSS', 'SQLite'],
        features: [
          'Room belajar kelompok dengan timer pomodoro tersinkronisasi',
          'Pemutar audio lofi / ambient sound penambah fokus',
          'To-do list harian yang dapat dicentang saat sesi fokus',
          'Statistik total jam belajar per mahasiswa'
        ],
        tasks: makeTasks('PomoTeam'),
        roles
      },
      {
        id: 'prod-3',
        name: 'FlashCardHub — Kartu Belajar Pintar & Kuis Spaced Repetition',
        tagline: 'Hafal materi ujian lebih cepat dan tahan lama',
        description: 'Platform pembuatan kartu flashcard materi kuliah dengan algoritma pengulangan berjarak (Spaced Repetition) untuk persiapan ujian.',
        category: 'Produktivitas & Belajar',
        difficulty: 'Lengkap & Nilai Portofolio',
        target_platform: platform,
        banner_theme: 'blue_campus',
        tech_stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Tailwind'],
        features: [
          'Pembuatan deck flashcard per mata kuliah (tanya & jawab)',
          'Mode kuis latihan mandiri dengan algoritma spaced repetition',
          'Berbagi deck materi dengan teman sekelas',
          'Statistik tingkat penguasaan materi per topik'
        ],
        tasks: makeTasks('FlashCardHub'),
        roles
      }
    ]
  };

  const selectedIdeas = domainCatalog[domain] || domainCatalog['kampus'];
  return { ideas: selectedIdeas };
}
