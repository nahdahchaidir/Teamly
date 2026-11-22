import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  CheckSquare,
  Sparkles,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  User,
  Users,
  UserPlus,
  LogOut,
  Menu,
  X,
  ListTodo,
  Send,
  LoaderCircle,
  Check,
  Edit2,
  Lightbulb,
  Rocket,
  Activity,
  HeartHandshake,
  Clock,
  Globe,
  Smartphone,
  Database,
  Cpu,
  GraduationCap,
  Store,
  Leaf,
  RotateCcw,
  Bell,
  MoreHorizontal,
  MessageSquare,
  Timer,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import api, { getApiErrorMessage } from './api';
import { generateProjectIdea } from './ideaGenerator';
import WelcomeScreen from './WelcomeScreen';
import AuthPage from './AuthPage';

// ================= SEED DEMO DATA =================
const defaultDemoProjects = [
  {
    id: 1,
    name: 'KantinGo — Pre-Order Kantin Kampus',
    description: 'Aplikasi pre-order makanan kantin kampus untuk memangkas waktu antre saat jam istirahat kuliah.',
    deadline: '2026-12-15',
    theme: 'blue_campus'
  },
  {
    id: 2,
    name: 'KasKu — Transparansi Kas Mahasiswa',
    description: 'Platform pencatatan iuran kas organisasi mahasiswa dengan bukti digital terverifikasi dan laporan transparan.',
    deadline: '2026-12-30',
    theme: 'purple_cooking'
  }
];

const defaultDemoMembers = [
  // Project 1 Members
  { id: 1, project_id: 1, name: 'Nadia Putri', role: 'UI/UX Designer & Dokumen', email: 'nadia@kampus.ac.id', initial: 'NP', bg: '#6366f1' },
  { id: 2, project_id: 1, name: 'Rizky Pratama', role: 'Backend & Database Engineer', email: 'rizky@kampus.ac.id', initial: 'RP', bg: '#059669' },
  { id: 3, project_id: 1, name: 'Fajar Ramadhan', role: 'Frontend Developer', email: 'fajar@kampus.ac.id', initial: 'FR', bg: '#d97706' },

  // Project 2 Members
  { id: 4, project_id: 2, name: 'Budi Santoso', role: 'Fullstack Developer', email: 'budi@kampus.ac.id', initial: 'BS', bg: '#8b5cf6' },
  { id: 5, project_id: 2, name: 'Siti Rahma', role: 'UI/UX & Tester', email: 'siti@kampus.ac.id', initial: 'SR', bg: '#ec4899' }
];

const defaultDemoTasks = [
  // Project 1 Tasks
  {
    id: 't1',
    project_id: 1,
    title: 'Rancang wireframe katalog kantin & nomor antrean',
    description: 'Wireframe responsif untuk katalog kantin dan nomor antrean.',
    status: 'done',
    priority: 'medium',
    assignee: 'Nadia Putri',
    assignee_id: 1,
    deadline: '2026-11-18',
    estimated_hours: 5,
    category: 'UI/UX',
    time_slot: '08.30',
    comments: [
      { id: 'c1', author: 'Nadia Putri', role: 'UI/UX', text: 'Wireframe v1 sudah selesai dan diunggah ke link Figma kelompok.', time: '2 hari lalu' },
      { id: 'c2', author: 'Rizky Pratama', role: 'Backend', text: 'Desainnya sudah pas! Format respon JSON akan saya sesuaikan.', time: '1 hari lalu' }
    ]
  },
  {
    id: 't2',
    project_id: 1,
    title: 'Implementasi API katalog menu & autentikasi JWT',
    description: 'Endpoint menu, stok real-time, dan akun pengguna.',
    status: 'doing',
    priority: 'high',
    assignee: 'Rizky Pratama',
    assignee_id: 2,
    deadline: '2026-11-20',
    estimated_hours: 8,
    category: 'Backend',
    time_slot: '10.30',
    comments: [
      { id: 'c3', author: 'Rizky Pratama', role: 'Backend', text: 'Autentikasi JWT sudah selesai, sedang melengkapi endpoint filter menu.', time: '3 jam lalu' }
    ]
  },
  {
    id: 't3',
    project_id: 1,
    title: 'Desain skema basis data pesanan & transaksi',
    description: 'Relasi tabel mahasiswa, pesanan, menu, dan detail transaksi.',
    status: 'done',
    priority: 'high',
    assignee: 'Rizky Pratama',
    assignee_id: 2,
    deadline: '2026-11-21',
    estimated_hours: 6,
    category: 'Database',
    time_slot: '13.00',
    comments: []
  },
  {
    id: 't4',
    project_id: 1,
    title: 'Integrasi frontend pemesanan dengan REST API',
    description: 'Tampilan keranjang, checkout pesanan, dan nomor antrean.',
    status: 'doing',
    priority: 'high',
    assignee: 'Fajar Ramadhan',
    assignee_id: 3,
    deadline: '2026-11-25',
    estimated_hours: 8,
    category: 'Frontend',
    time_slot: '15.30',
    comments: [
      { id: 'c4', author: 'Fajar Ramadhan', role: 'Frontend', text: 'Halaman checkout sudah terhubung ke API pesanan.', time: 'Baru saja' }
    ]
  },
  {
    id: 't5',
    project_id: 1,
    title: 'Pengujian fungsionalitas & bab laporan tugas',
    description: 'Uji alur checkout dan tulis bab pengujian untuk laporan tugas.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Nadia Putri',
    assignee_id: 1,
    deadline: '2026-11-28',
    estimated_hours: 6,
    category: 'Laporan',
    time_slot: '17.00',
    comments: []
  },

  // Project 2 Tasks
  {
    id: 't6',
    project_id: 2,
    title: 'Setup arsitektur project & skema kas iuran',
    description: 'Struktur tabel kas, pencatatan transaksi masuk dan keluar.',
    status: 'done',
    priority: 'high',
    assignee: 'Budi Santoso',
    assignee_id: 4,
    deadline: '2026-11-15',
    estimated_hours: 8,
    category: 'Backend',
    time_slot: '09.00',
    comments: []
  },
  {
    id: 't7',
    project_id: 2,
    title: 'Desain UI form upload bukti transfer kas',
    description: 'Form upload bukti transfer dengan preview gambar.',
    status: 'doing',
    priority: 'medium',
    assignee: 'Siti Rahma',
    assignee_id: 5,
    deadline: '2026-11-28',
    estimated_hours: 5,
    category: 'Frontend',
    time_slot: '14.00',
    comments: []
  }
];

const statusMeta = {
  todo: { label: 'Belum Mulai', color: 'todo' },
  doing: { label: 'Dikerjakan', color: 'doing' },
  review: { label: 'Review', color: 'review' },
  done: { label: 'Selesai', color: 'done' }
};

const statusOrder = ['todo', 'doing', 'review', 'done'];

const colorOptions = [
  { label: 'Indigo', hex: '#6366f1' },
  { label: 'Emerald', hex: '#059669' },
  { label: 'Amber', hex: '#d97706' },
  { label: 'Blue', hex: '#0284c7' },
  { label: 'Purple', hex: '#8b5cf6' },
  { label: 'Pink', hex: '#ec4899' }
];

// Survey Options - Bahasa Simpel & Mudah Dipahami Orang Awam
const domainSurveyOptions = [
  {
    id: 'kampus',
    title: 'Seputar Kampus & Kuliah',
    desc: 'Antrean kantin, jadwal kuliah, peminjaman lab praktikum',
    icon: GraduationCap,
    colorClass: 'blue'
  },
  {
    id: 'bisnis',
    title: 'Bisnis & Toko Kecil',
    desc: 'Kasir pembayaran, katalog jualan, pencatatan stok barang',
    icon: Store,
    colorClass: 'amber'
  },
  {
    id: 'lingkungan',
    title: 'Sosial & Warga',
    desc: 'Bank sampah daur ulang, donasi barang/makanan, info warga',
    icon: Leaf,
    colorClass: 'green'
  },
  {
    id: 'lifestyle',
    title: 'Hobi & Gaya Hidup',
    desc: 'Latihan olahraga, resep hemat anak kos, jadwal harian',
    icon: Activity,
    colorClass: 'violet'
  },
  {
    id: 'organisasi',
    title: 'Organisasi & Komunitas',
    desc: 'Iuran kas kelompok, voting pemilihan ketua, pendaftaran acara',
    icon: HeartHandshake,
    colorClass: 'coral'
  },
  {
    id: 'produktivitas',
    title: 'Belajar & Produktivitas',
    desc: 'Jadwal belajar kelompok, pengingat tugas, target harian',
    icon: Clock,
    colorClass: 'purple'
  }
];

const platformSurveyOptions = [
  { id: 'Web App', label: 'Website di Browser', sub: 'Mudah dibuka di HP dan laptop tanpa download', icon: Globe },
  { id: 'Mobile App', label: 'Aplikasi HP', sub: 'Aplikasi yang bisa dipasang di HP Android / iOS', icon: Smartphone },
  { id: 'Sistem Informasi', label: 'Kasir & Pengolah Data', sub: 'Fokus formulir input data dan tabel daftar rapi', icon: Database },
  { id: 'AI & Smart System', label: 'Aplikasi Cerdas', sub: 'Dilengkapi rekomendasi otomatis pintar', icon: Cpu }
];

const teamSurveyOptions = [
  { id: 1, label: 'Sendiri (1 Orang)', sub: 'Tugas perorangan mandiri' },
  { id: 2, label: 'Berdua (2 Orang)', sub: 'Bagi dua: tampilan & sistem data' },
  { id: 3, label: 'Bertiga (3 Orang)', sub: 'Tampilan, logika, dan laporan' },
  { id: 4, label: 'Tim Rame-rame (4-5 Orang)', sub: 'Tim lengkap ada penguji & penyusun dokumen' }
];

const durationSurveyOptions = [
  { id: 'quick', label: 'Cepat (< 2 Minggu)', sub: 'Fokus fitur inti yang simpel dan pasti cepat beres' },
  { id: 'medium', label: 'Standar (~ 1 Bulan)', sub: 'Waktu cukup untuk merapikan tampilan dan laporan' },
  { id: 'long', label: 'Panjang (> 1 Bulan)', sub: 'Leluasa membuat fitur lengkap untuk portofolio' }
];

const difficultySurveyOptions = [
  { id: 'easy', label: 'Mudah & Ramah Pemula', sub: 'Alur simpel dan kode tidak rumit dipahami' },
  { id: 'standard', label: 'Standar Tugas Kuliah', sub: 'Pas untuk target nilai bagus dosen' },
  { id: 'ambitious', label: 'Menantang & Keren', sub: 'Banyak fitur seru untuk portofolio' }
];

const featureSurveyOptions = [
  { id: 'crud', label: 'Pencatatan & Riwayat Data', sub: 'Bisa input, edit, cari, dan hapus data dengan rapi', icon: Database },
  { id: 'auth', label: 'Login Akun & Akses Pengguna', sub: 'Bisa bedakan akun Admin dan Anggota', icon: ShieldCheck },
  { id: 'notif', label: 'Pengingat & Notifikasi', sub: 'Pengingat otomatis batas waktu atau perubahan tugas', icon: Bell },
  { id: 'report', label: 'Ringkasan & Laporan Visual', sub: 'Grafik visual dan rangkuman data otomatis', icon: BarChart3 }
];

const timelineHours = ['07.00', '08.00', '09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00'];

// ================= TECH COLLABORATION SVG ILLUSTRATIONS =================

export function TechCollabIllustration({ theme }) {
  if (theme === 'blue_campus' || theme === 'web') {
    return (
      <svg className="habo-banner-svg" viewBox="0 0 160 120" fill="none">
        <rect x="55" y="16" width="95" height="68" rx="6" fill="#ffffff" fillOpacity="0.28" />
        <rect x="55" y="16" width="95" height="15" rx="6" fill="#ffffff" fillOpacity="0.38" />
        <circle cx="65" cy="23" r="2.5" fill="#f87171" />
        <circle cx="73" cy="23" r="2.5" fill="#fbbf24" />
        <circle cx="81" cy="23" r="2.5" fill="#34d399" />
        <rect x="65" y="38" width="30" height="4" rx="2" fill="#ffffff" fillOpacity="0.9" />
        <rect x="100" y="38" width="35" height="4" rx="2" fill="#93c5fd" />
        <rect x="72" y="46" width="45" height="4" rx="2" fill="#ffffff" fillOpacity="0.75" />
        <rect x="72" y="54" width="28" height="4" rx="2" fill="#fde047" />
        <rect x="104" y="54" width="22" height="4" rx="2" fill="#86efac" />
        <rect x="65" y="62" width="20" height="4" rx="2" fill="#ffffff" fillOpacity="0.9" />
        <path d="M45 84 H155 L160 92 H40 L45 84 Z" fill="#ffffff" fillOpacity="0.4" />
        <circle cx="36" cy="48" r="9" fill="#ffffff" />
        <path d="M26 68 C26 60 30 58 36 58 C42 58 46 60 46 68 Z" fill="#ffffff" fillOpacity="0.8" />
      </svg>
    );
  }

  if (theme === 'purple_cooking' || theme === 'design') {
    return (
      <svg className="habo-banner-svg" viewBox="0 0 160 120" fill="none">
        <rect x="85" y="14" width="56" height="88" rx="8" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" />
        <rect x="102" y="18" width="22" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.6" />
        <rect x="92" y="28" width="42" height="18" rx="4" fill="#ffffff" fillOpacity="0.8" />
        <circle cx="100" cy="37" r="4" fill="#8b5cf6" />
        <rect x="108" y="34" width="20" height="3" rx="1.5" fill="#c4b5fd" />
        <rect x="92" y="52" width="19" height="22" rx="3" fill="#ffffff" fillOpacity="0.6" />
        <rect x="115" y="52" width="19" height="22" rx="3" fill="#ffffff" fillOpacity="0.6" />
        <rect x="92" y="80" width="42" height="10" rx="5" fill="#ffffff" />
        <path d="M60 45 L72 65 L66 66 L70 76 L65 78 L61 68 L54 71 Z" fill="#ffffff" />
        <circle cx="50" cy="25" r="7" fill="#fb7185" />
      </svg>
    );
  }

  // peach_reading / rocket
  return (
    <svg className="habo-banner-svg" viewBox="0 0 160 120" fill="none">
      <path d="M120 18 C100 24 90 45 92 68 L108 84 C130 86 150 76 156 56 C152 40 136 22 120 18 Z" fill="#ffffff" />
      <circle cx="125" cy="45" r="7" fill="#f43f5e" />
      <circle cx="125" cy="45" r="4.5" fill="#ffffff" />
      <path d="M92 68 L82 78 L96 80 Z" fill="#fecdd3" />
      <path d="M108 84 L110 98 L120 88 Z" fill="#fecdd3" />
      <path d="M94 82 C85 95 80 105 88 112 C96 110 102 98 106 86 Z" fill="#fde047" />
      <circle cx="70" cy="25" r="3" fill="#ffffff" />
      <circle cx="55" cy="50" r="4" fill="#ffffff" fillOpacity="0.7" />
    </svg>
  );
}

export function SpotlightCollabIllustration() {
  return (
    <div className="habo-spotlight-visual">
      <svg className="habo-spotlight-svg" viewBox="0 0 240 220" fill="none">
        <defs>
          <linearGradient id="collabSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect width="240" height="220" fill="url(#collabSky)" />

        <rect x="25" y="20" width="190" height="120" rx="8" fill="#ffffff" fillOpacity="0.95" />
        <rect x="25" y="20" width="190" height="20" rx="8" fill="#f1f5f9" />
        <circle cx="36" cy="30" r="3" fill="#ef4444" />
        <circle cx="44" cy="30" r="3" fill="#f59e0b" />
        <circle cx="52" cy="30" r="3" fill="#10b981" />

        <rect x="35" y="50" width="35" height="75" rx="4" fill="#eff6ff" />
        <rect x="40" y="58" width="25" height="4" rx="2" fill="#3b82f6" />
        <rect x="40" y="66" width="20" height="3" rx="1.5" fill="#93c5fd" />
        <rect x="40" y="72" width="22" height="3" rx="1.5" fill="#93c5fd" />

        <rect x="78" y="50" width="60" height="35" rx="5" fill="#f8fafc" stroke="#e2e8f0" />
        <rect x="84" y="58" width="30" height="4" rx="2" fill="#64748b" />
        <rect x="84" y="66" width="45" height="6" rx="2" fill="#10b981" />

        <rect x="146" y="50" width="58" height="35" rx="5" fill="#f8fafc" stroke="#e2e8f0" />
        <rect x="152" y="58" width="26" height="4" rx="2" fill="#64748b" />
        <rect x="152" y="66" width="42" height="6" rx="2" fill="#6366f1" />

        <rect x="78" y="92" width="126" height="34" rx="5" fill="#f8fafc" stroke="#e2e8f0" />
        <rect x="84" y="100" width="48" height="4" rx="2" fill="#0f172a" />
        <rect x="84" y="108" width="105" height="5" rx="2.5" fill="#3b82f6" />

        <g transform="translate(25, 150)">
          <circle cx="45" cy="18" r="12" fill="#ffffff" />
          <path d="M28 55 C28 40 34 36 45 36 C56 36 62 40 62 55 Z" fill="#ffffff" />
          <path d="M52 36 L70 22" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

          <circle cx="145" cy="18" r="12" fill="#ffffff" />
          <path d="M128 55 C128 40 134 36 145 36 C156 36 162 40 162 55 Z" fill="#ffffff" />
          <path d="M138 36 L120 22" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <circle cx="95" cy="18" r="5" fill="#fde047" />
        </g>
      </svg>
    </div>
  );
}

// 4 Custom Metric Card Illustrations (Styled like user reference image)
export function TotalTasksIllustration() {
  return (
    <svg width="88" height="70" viewBox="0 0 88 70" fill="none">
      <circle cx="58" cy="35" r="30" fill="#ffffff" fillOpacity="0.14" />
      {/* Clipboard paper */}
      <rect x="24" y="10" width="46" height="54" rx="8" fill="#ffffff" />
      {/* Clipboard clip */}
      <rect x="37" y="6" width="20" height="8" rx="3" fill="#ea580c" />
      <circle cx="47" cy="10" r="2" fill="#ffffff" />
      {/* Checklist items */}
      <rect x="32" y="22" width="6" height="6" rx="2" fill="#ea580c" />
      <rect x="42" y="23" width="22" height="4" rx="2" fill="#fed7aa" />
      <rect x="32" y="34" width="6" height="6" rx="2" fill="#10b981" />
      <rect x="42" y="35" width="18" height="4" rx="2" fill="#fed7aa" />
      <rect x="32" y="46" width="6" height="6" rx="2" fill="#ea580c" />
      <rect x="42" y="47" width="24" height="4" rx="2" fill="#fed7aa" />
      {/* Sparkles */}
      <circle cx="14" cy="24" r="3.5" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="76" cy="16" r="3" fill="#fde047" />
    </svg>
  );
}

export function DoingTasksIllustration() {
  return (
    <svg width="88" height="70" viewBox="0 0 88 70" fill="none">
      <circle cx="58" cy="35" r="30" fill="#ffffff" fillOpacity="0.14" />
      {/* Laptop base */}
      <path d="M16 54 L72 54 C74 54 75 52 74 50 L68 19 C67.5 16 65 14 62 14 L26 14 C23 14 20.5 16 20 19 L14 50 C13 52 14 54 16 54 Z" fill="#ffffff" />
      {/* Laptop screen */}
      <rect x="22" y="18" width="44" height="28" rx="3" fill="#1e3a8a" />
      {/* Code / layout lines */}
      <rect x="26" y="23" width="16" height="3" rx="1.5" fill="#60a5fa" />
      <rect x="26" y="29" width="30" height="3" rx="1.5" fill="#93c5fd" />
      <rect x="26" y="35" width="22" height="3" rx="1.5" fill="#38bdf8" />
      {/* Active cursor / pointer */}
      <path d="M54 32 L60 40 L57 41 L55 45 L52 44 L54 40 L51 39 Z" fill="#f59e0b" />
      {/* Notification circle */}
      <circle cx="70" cy="18" r="4.5" fill="#ef4444" />
    </svg>
  );
}

export function PriorityTasksIllustration() {
  return (
    <svg width="88" height="70" viewBox="0 0 88 70" fill="none">
      <circle cx="58" cy="35" r="30" fill="#ffffff" fillOpacity="0.14" />
      {/* Dartboard / Target Outer */}
      <circle cx="48" cy="36" r="23" fill="#ffffff" />
      <circle cx="48" cy="36" r="17" fill="#8b5cf6" />
      <circle cx="48" cy="36" r="11" fill="#ffffff" />
      <circle cx="48" cy="36" r="5" fill="#ef4444" />
      {/* Spark / Flame badge */}
      <path d="M22 14 C22 14 33 21 39 29 L33 31 Z" fill="#fde047" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="70" cy="16" r="3.5" fill="#ffffff" fillOpacity="0.85" />
    </svg>
  );
}

export function OverdueTasksIllustration({ isOverdue }) {
  return (
    <svg width="88" height="70" viewBox="0 0 88 70" fill="none">
      <circle cx="58" cy="35" r="30" fill="#ffffff" fillOpacity="0.14" />
      {isOverdue ? (
        <>
          {/* Alarm Clock */}
          <circle cx="46" cy="38" r="19" fill="#ffffff" />
          <path d="M33 21 L39 26" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M59 21 L53 26" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          {/* Clock face */}
          <circle cx="46" cy="38" r="14" fill="#fee2e2" />
          <path d="M46 29 L46 38 L52 41" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          {/* Warning badge */}
          <circle cx="66" cy="22" r="6.5" fill="#f59e0b" />
          <rect x="65" y="19" width="2" height="4" rx="1" fill="#ffffff" />
          <circle cx="66" cy="25" r="1" fill="#ffffff" />
        </>
      ) : (
        <>
          {/* Calendar Check Shield */}
          <rect x="28" y="17" width="38" height="40" rx="7" fill="#ffffff" />
          <rect x="28" y="17" width="38" height="11" rx="7" fill="#047857" />
          <circle cx="36" cy="13" r="2" fill="#ffffff" />
          <circle cx="58" cy="13" r="2" fill="#ffffff" />
          {/* Check mark inside */}
          <path d="M38 38 L45 45 L56 32" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="70" cy="15" r="3" fill="#fde047" />
        </>
      )}
    </svg>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('tp_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('tp_user') || 'null'));
  const [demo, setDemo] = useState(!token);
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' | 'workspace' | 'auth'
  const [authInitialMode, setAuthInitialMode] = useState('login');

  useEffect(() => {
    localStorage.removeItem('tp_registered_users');
  }, []);

  // Initialize data: selalu kosong, user buat sendiri
  const [projects, setProjects] = useState(() => {
    if (token) {
      const saved = localStorage.getItem('tp_saved_projects');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
      return []; // Akun baru: kosong
    }
    return []; // Guest mode: kosong
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    if (token) {
      const savedId = localStorage.getItem('tp_saved_active_pid');
      if (savedId) return Number(savedId);
      return null;
    }
    return null;
  });

  const [allTasks, setAllTasks] = useState(() => {
    if (token) {
      const saved = localStorage.getItem('tp_saved_tasks');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
      return []; // Kosong
    }
    return [];
  });

  const [allMembers, setAllMembers] = useState(() => {
    if (token) {
      const saved = localStorage.getItem('tp_saved_members');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
      return []; // Kosong
    }
    return [];
  });

  // Current active project
  const currentProject = useMemo(() => {
    if (!projects || projects.length === 0) return null;
    return projects.find(p => p.id === activeProjectId) || projects[0] || null;
  }, [projects, activeProjectId]);

  // Tasks of CURRENT project ONLY
  const currentProjectTasks = useMemo(() => {
    if (!currentProject) return [];
    return allTasks.filter(t => t.project_id === currentProject.id);
  }, [allTasks, currentProject]);

  // Members of CURRENT project ONLY
  const currentProjectMembers = useMemo(() => {
    if (!currentProject) return [];
    return allMembers.filter(m => m.project_id === currentProject.id);
  }, [allMembers, currentProject]);

  // Navigation: 'dashboard' | 'generator' | 'tasks' | 'team'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [taskView, setTaskView] = useState('board'); // 'board' | 'list'

  // Survey Step State: 1 to 6 (Questions), 7 (Results)
  const [surveyStep, setSurveyStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('kampus');
  const [selectedPlatform, setSelectedPlatform] = useState('Web App');
  const [selectedTeamSize, setSelectedTeamSize] = useState(3);
  const [selectedDuration, setSelectedDuration] = useState('medium');
  const [selectedDifficulty, setSelectedDifficulty] = useState('standard');
  const [selectedKeyFeature, setSelectedKeyFeature] = useState('crud');
  const [generatedIdeas, setGeneratedIdeas] = useState(null);
  const [isAnalyzingIdeas, setIsAnalyzingIdeas] = useState(false);

  // Guest & Auth status
  const isGuest = !token || !user;
  const [authModalPrompt, setAuthModalPrompt] = useState('');

  // ===== ROLE DETECTION =====
  // userRole: 'lead' (pemilik project) | 'member' (anggota) | 'guest'
  const userRole = useMemo(() => {
    if (isGuest) return 'guest';
    if (!currentProject) return 'lead';
    // Pemilik project
    if (currentProject.owner_email && currentProject.owner_email === user?.email) return 'lead';
    if (currentProject.owner_id && currentProject.owner_id === user?.id) return 'lead';
    // Anggota project (email cocok)
    const memberMatch = currentProjectMembers.find(m => m.email && m.email.toLowerCase() === user?.email?.toLowerCase());
    if (memberMatch) return 'member';
    return 'lead'; // fallback: anggap lead
  }, [isGuest, user, currentProject, currentProjectMembers]);

  const isLead = userRole === 'lead';
  const isMember = userRole === 'member';

  // Tugas yang terlihat oleh user saat ini
  const visibleTasks = useMemo(() => {
    if (!isMember || !user) return currentProjectTasks;
    // Anggota hanya lihat tugas yang di-assign ke mereka
    return currentProjectTasks.filter(t =>
      (t.assignee && t.assignee.toLowerCase() === user.name?.toLowerCase()) ||
      (t.assignee_id && currentProjectMembers.find(m => m.email?.toLowerCase() === user.email?.toLowerCase())?.id === t.assignee_id)
    );
  }, [isMember, user, currentProjectTasks, currentProjectMembers]);
  const [deleteProjectConfirm, setDeleteProjectConfirm] = useState(null); // stores project to delete

  // Filters, Search & Dropdowns
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Activity & Email Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('tp_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 1,
        title: 'Tugas Ditugaskan',
        taskTitle: 'Implementasi API katalog menu & autentikasi JWT',
        recipientName: 'Rizky Pratama',
        action: 'Tugas sprint ditugaskan ke Rizky Pratama',
        time: '15 menit lalu',
        unread: true
      },
      {
        id: 2,
        title: 'Status Diperbarui',
        taskTitle: 'Rancang wireframe katalog kantin & nomor antrean',
        recipientName: 'Nadia Putri',
        action: 'Status tugas diubah ke Selesai',
        time: '1 jam lalu',
        unread: true
      },
      {
        id: 3,
        title: 'Status Diperbarui',
        taskTitle: 'Desain skema basis data pesanan & transaksi',
        recipientName: 'Rizky Pratama',
        action: 'Status tugas diubah ke Selesai',
        time: '3 jam lalu',
        unread: false
      }
    ];
  });

  // Modals & Popovers
  const [modal, setModal] = useState(''); // 'task' | 'edit_task' | 'project' | 'member' | 'auth'
  const [selectedTask, setSelectedTask] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].hex);
  const [authMode, setAuthMode] = useState('login');
  const [pendingCredentials, setPendingCredentials] = useState(null);
  const [projectDropdown, setProjectDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Guard action for Guest (Guest can view, but must login to edit/add)
  const requireLogin = (actionCallback, actionName = 'memakai aplikasi') => {
    if (isGuest) {
      setAuthModalPrompt(`Perlu login terlebih dahulu untuk ${actionName}. Silakan masuk atau buat akun baru.`);
      setAuthMode('login');
      setModal('auth');
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  // Kirim notifikasi aktivitas tim
  const sendChangeNotification = (taskOrTitle, actionText, assignedMemberOrName) => {
    let member = null;
    if (typeof assignedMemberOrName === 'object' && assignedMemberOrName !== null) {
      member = assignedMemberOrName;
    } else if (typeof assignedMemberOrName === 'string') {
      member = currentProjectMembers.find(m => m.name === assignedMemberOrName);
    }
    const taskTitle = typeof taskOrTitle === 'object' ? taskOrTitle.title : taskOrTitle;
    const recipientName = member ? member.name : (typeof assignedMemberOrName === 'string' ? assignedMemberOrName : 'Anggota Tim');

    const newNotif = {
      id: Date.now(),
      title: 'Aktivitas Tugas',
      taskTitle: taskTitle,
      recipientName: recipientName,
      action: actionText,
      time: 'Baru saja',
      unread: true
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev.slice(0, 19)];
      try { localStorage.setItem('tp_notifications', JSON.stringify(updated)); } catch {}
      return updated;
    });

    notify(`🔔 ${actionText}`);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, unread: false }));
      try { localStorage.setItem('tp_notifications', JSON.stringify(updated)); } catch {}
      return updated;
    });
    notify('Semua notifikasi ditandai telah dibaca');
  };

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      // Logged-in user: always save to localStorage so refresh keeps data
      try {
        localStorage.setItem('tp_saved_projects', JSON.stringify(projects));
        localStorage.setItem('tp_saved_tasks', JSON.stringify(allTasks));
        localStorage.setItem('tp_saved_members', JSON.stringify(allMembers));
        if (activeProjectId) {
          localStorage.setItem('tp_saved_active_pid', String(activeProjectId));
        } else {
          localStorage.removeItem('tp_saved_active_pid');
        }
      } catch {}

      // ===== Sync ke tp_shared_data agar anggota dapat data terbaru =====
      // Hanya lead yang perlu update shared store (anggota read-only dari shared)
      try {
        const sharedRaw = localStorage.getItem('tp_shared_data');
        if (sharedRaw) {
          const sharedData = JSON.parse(sharedRaw);
          // Update tasks project yang ada di shared data
          projects.forEach(p => {
            const pTasks = allTasks.filter(t => t.project_id === p.id);
            const pMembers = allMembers.filter(m => m.project_id === p.id);
            // Cek apakah project ini ada di shared data
            const isShared = sharedData.projects.some(sp => sp.id === p.id);
            if (isShared) {
              // Update tasks
              const otherTasks = sharedData.tasks.filter(t => t.project_id !== p.id);
              sharedData.tasks = [...otherTasks, ...pTasks];
              // Update members
              const otherMembers = sharedData.members.filter(m => m.project_id !== p.id);
              sharedData.members = [...otherMembers, ...pMembers];
            }
          });
          localStorage.setItem('tp_shared_data', JSON.stringify(sharedData));
        }
      } catch {}
    } else if (demo) {
      // Guest/demo: save to separate demo keys
      try {
        localStorage.setItem('tp_demo_projects', JSON.stringify(projects));
        localStorage.setItem('tp_demo_tasks', JSON.stringify(allTasks));
        localStorage.setItem('tp_demo_members', JSON.stringify(allMembers));
        if (activeProjectId) localStorage.setItem('tp_demo_active_pid', String(activeProjectId));
      } catch {}
    }
  }, [demo, token, projects, allTasks, allMembers, activeProjectId]);

  // Backend sync
  async function loadBackendProjects() {
    try {
      const r = await api.get('/projects');
      setProjects(r.data);
      if (r.data.length && (!activeProjectId || !r.data.find(p => p.id === activeProjectId))) {
        setActiveProjectId(r.data[0].id);
      }
    } catch {
      notify('Koneksi backend gagal');
    }
  }

  async function loadBackendProjectData(pid) {
    if (!pid || demo) return;
    try {
      const [tRes, mRes] = await Promise.all([
        api.get(`/projects/${pid}/tasks`),
        api.get(`/projects/${pid}/members`)
      ]);
      setAllTasks(prev => {
        const other = prev.filter(t => t.project_id !== pid);
        return [...other, ...tRes.data];
      });
      setAllMembers(prev => {
        const other = prev.filter(m => m.project_id !== pid);
        return [...other, ...mRes.data];
      });
    } catch {
      notify('Gagal memuat data project');
    }
  }

  useEffect(() => {
    if (token) {
      setDemo(false);
      // Do NOT load demo data – keep whatever is in state (empty for new users)

      if (token.split('.').length !== 3) {
        logout();
        return;
      }

      // Backend JWT token check
      api.get('/auth/me')
        .then(r => {
          setUser(r.data);
          loadBackendProjects();
        })
        .catch(err => {
          if (err.response && [401, 403].includes(err.response.status)) {
            logout();
          } else {
            notify('Tidak dapat memverifikasi sesi. Periksa koneksi backend.');
          }
        });
    }
  }, [token]);

  useEffect(() => {
    if (token && activeProjectId) {
      loadBackendProjectData(activeProjectId);
    }
  }, [token, activeProjectId]);

  const logout = () => {
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
    setToken(null);
    setUser(null);
    setDemo(true);
    setProjects([]);
    setActiveProjectId(null);
    setAllTasks([]);
    setAllMembers([]);
    notify('Berhasil keluar');
  };

  // ===== LOAD SHARED PROJECT untuk anggota yang baru login =====
  const loadSharedProjectForMember = (loggedInEmail) => {
    try {
      const sharedRaw = localStorage.getItem('tp_shared_data');
      if (!sharedRaw) return false;
      const sharedData = JSON.parse(sharedRaw);
      // Cari project di mana email ini terdaftar sebagai anggota
      const memberRecord = (sharedData.members || []).find(
        m => m.email && m.email.toLowerCase() === loggedInEmail.toLowerCase()
      );
      if (!memberRecord) return false;
      const sharedProject = (sharedData.projects || []).find(p => p.id === memberRecord.project_id);
      if (!sharedProject) return false;
      // Ambil semua tasks project itu dari shared data
      const sharedTasks = (sharedData.tasks || []).filter(t => t.project_id === sharedProject.id);
      // Ambil semua members project itu
      const sharedMembers = (sharedData.members || []).filter(m => m.project_id === sharedProject.id);
      // Set ke state — anggota hanya melihat project yang mereka ikuti
      setProjects([sharedProject]);
      setActiveProjectId(sharedProject.id);
      setAllTasks(sharedTasks);
      setAllMembers(sharedMembers);
      return true;
    } catch {
      return false;
    }
  };

  // Statistics for CURRENT PROJECT ONLY
  // Anggota: statistik hanya dari tugas mereka
  const stats = useMemo(() => {
    const tasksForStats = isMember ? visibleTasks : currentProjectTasks;
    const counts = { todo: 0, doing: 0, review: 0, done: 0 };
    let highPriorityCount = 0;
    const today = new Date().toISOString().split('T')[0];
    let overdueCount = 0;

    tasksForStats.forEach(t => {
      counts[t.status] = (counts[t.status] || 0) + 1;
      if (t.priority === 'high' && t.status !== 'done') highPriorityCount++;
      if (t.deadline && t.deadline < today && t.status !== 'done') overdueCount++;
    });

    const total = tasksForStats.length;
    const progress = total ? Math.round((counts.done / total) * 100) : 0;
    const activeTasks = counts.doing + counts.review;

    return { counts, total, progress, highPriorityCount, overdueCount, activeTasks };
  }, [currentProjectTasks, visibleTasks, isMember]);

  // Filtered Tasks for CURRENT PROJECT (anggota hanya lihat tugasnya)
  const filteredTasks = useMemo(() => {
    const baseTasks = isMember ? visibleTasks : currentProjectTasks;
    return baseTasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [currentProjectTasks, visibleTasks, isMember, searchQuery, statusFilter, priorityFilter]);

  // Instant live search matches
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const baseTasks = isMember ? visibleTasks : currentProjectTasks;
    return baseTasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.assignee && t.assignee.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  }, [currentProjectTasks, visibleTasks, isMember, searchQuery]);

  // Upcoming Tasks
  const upcomingTasks = useMemo(() => {
    const baseTasks = isMember ? visibleTasks : currentProjectTasks;
    return baseTasks
      .filter(t => t.status !== 'done' && t.deadline)
      .sort((a, b) => (a.deadline > b.deadline ? 1 : -1))
      .slice(0, 4);
  }, [currentProjectTasks]);

  // ================= SURVEY AI GENERATOR =================

  const handleRunSurveyAnalysis = async () => {
    setIsAnalyzingIdeas(true);
    try {
      const result = await generateProjectIdea({
        domain: selectedDomain,
        courseTopic: selectedPlatform,
        memberCount: selectedTeamSize,
        platform: selectedPlatform,
        difficulty: selectedDifficulty
      });
      if (result && result.ideas) {
        setGeneratedIdeas(result.ideas);
        setSurveyStep(7); // Jump to results step
        notify('🎯 Berhasil menemukan 3 rekomendasi ide project!');
      }
    } catch {
      notify('Gagal menganalisis ide project');
    } finally {
      setIsAnalyzingIdeas(false);
    }
  };

  const handleSelectIdea = async (idea) => {
    if (!requireLogin(null, 'menerapkan ide project AI')) return;
    const newProjectPayload = {
      name: idea.name,
      description: idea.description,
      deadline: '',
      theme: idea.banner_theme || 'blue_campus'
    };

    let newProjectId;

    if (demo) {
      newProjectId = Date.now();
      const newProj = { id: newProjectId, ...newProjectPayload };

      const slots = ['08.30', '10.30', '13.00', '15.30', '17.00'];

      // Anggota dan deadline tugas dikosongkan sesuai permintaan pengguna
      const generatedTasks = (idea.tasks || []).map((t, idx) => ({
        id: 'gt_' + Date.now() + '_' + idx,
        project_id: newProjectId,
        title: t.title,
        description: t.description || '',
        status: 'todo',
        priority: t.priority || 'medium',
        deadline: '', // dikosongkan
        estimated_hours: Number(t.estimated_hours || 6),
        assignee_id: null, // dikosongkan
        assignee: '', // dikosongkan
        category: t.category || (idx === 0 ? 'UI/UX' : idx === 1 ? 'Database' : idx === 2 ? 'Backend' : idx === 3 ? 'Frontend' : 'Testing'),
        time_slot: slots[idx % slots.length],
        comments: []
      }));

      setProjects([newProj, ...projects]);
      // Tidak menambahkan dummy anggota
      setAllTasks([...generatedTasks, ...allTasks]);
      setActiveProjectId(newProjectId);
    } else {
      try {
        const rProj = await api.post('/projects', newProjectPayload);
        newProjectId = rProj.data.id;
        setProjects([rProj.data, ...projects]);
        setActiveProjectId(newProjectId);

        // Tidak menambahkan dummy anggota, buat tugas tanpa penanggung jawab & tanpa deadline
        for (let i = 0; i < (idea.tasks || []).length; i++) {
          const t = idea.tasks[i];
          await api.post(`/projects/${newProjectId}/tasks`, {
            title: t.title,
            description: t.description || '',
            status: 'todo',
            priority: t.priority || 'medium',
            deadline: null, // dikosongkan
            estimated_hours: Number(t.estimated_hours || 6),
            assignee_id: null // dikosongkan
          });
        }
        await loadBackendProjectData(newProjectId);
      } catch {
        notify('Gagal membuat project di backend');
        return;
      }
    }

    setSurveyStep(1);
    setActiveTab('dashboard');
    notify(`🎉 Project "${idea.name}" dibuat! Pembagian tugas & deskripsi siap dikelola.`);
  };

  // ================= TASK ACTIONS =================

  const toggleComplete = async (task) => {
    if (!requireLogin(null, 'mengubah status tugas')) return;
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    await changeTaskStatus(task, nextStatus);
    notify(nextStatus === 'done' ? 'Tugas diselesaikan! 🎉' : 'Tugas dikembalikan ke Belum Mulai');
  };

  const moveTaskStatus = async (task, direction) => {
    if (!requireLogin(null, 'memindahkan status tugas')) return;
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= statusOrder.length) return;
    const nextStatus = statusOrder[nextIndex];
    await changeTaskStatus(task, nextStatus);
  };

  const changeTaskStatus = async (task, newStatus) => {
    if (!requireLogin(null, 'mengubah status tugas')) return;
    // Always update locally first
    setAllTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    sendChangeNotification(task, `Status tugas diubah menjadi "${statusMeta[newStatus]?.label || newStatus}"`, task.assignee);
    // Try backend non-blocking (real JWT only)
    if (!demo && token) {
      try {
        const r = await api.patch(`/tasks/${task.id}`, { status: newStatus });
        setAllTasks(prev => prev.map(t => t.id === task.id ? { ...r.data, comments: t.comments || [] } : t));
      } catch {}
    }
  };

  const deleteTask = async (task) => {
    if (!requireLogin(null, 'menghapus tugas')) return;
    if (!confirm(`Hapus tugas "${task.title}"?`)) return;
    // Always delete locally first
    setAllTasks(prev => prev.filter(t => t.id !== task.id));
    sendChangeNotification(task, 'Tugas dihapus dari sprint project', task.assignee);
    notify('Tugas dihapus');
    // Try backend non-blocking (real JWT only)
    if (!demo && token) {
      try { await api.delete(`/tasks/${task.id}`); } catch {}
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!requireLogin(null, 'menambah tugas baru')) return;
    if (!currentProject) { notify('Pilih project terlebih dahulu'); return; }
    const f = new FormData(e.currentTarget);
    const assigneeId = f.get('assignee_id') ? Number(f.get('assignee_id')) : null;
    const assignedMember = currentProjectMembers.find(m => m.id === assigneeId);

    const payload = {
      project_id: currentProject.id,
      title: f.get('title'),
      description: f.get('description') || '',
      status: f.get('status') || 'todo',
      priority: f.get('priority') || 'medium',
      deadline: f.get('deadline') || null,
      estimated_hours: Number(f.get('hours') || 4),
      assignee_id: assigneeId,
      category: f.get('category') || 'Frontend',
      time_slot: f.get('time_slot') || '11.00'
    };

    // Always save locally first
    const newTask = {
      id: 't' + Date.now(),
      ...payload,
      assignee: assignedMember ? assignedMember.name : 'Unassigned',
      comments: []
    };
    setAllTasks(prev => [newTask, ...prev]);
    sendChangeNotification(payload.title, 'Tugas baru ditugaskan ke Anda', assignedMember || assigneeId);
    notify('Tugas berhasil ditambahkan');
    setModal('');

    // Try backend non-blocking (real JWT only)
    if (!demo && token) {
      try {
        const r = await api.post(`/projects/${currentProject.id}/tasks`, payload);
        setAllTasks(prev => prev.map(t => t.id === newTask.id ? { ...r.data, assignee: newTask.assignee, comments: [] } : t));
      } catch {}
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!requireLogin(null, 'mengedit tugas')) return;
    if (!selectedTask) return;
    const f = new FormData(e.currentTarget);
    const assigneeId = f.get('assignee_id') ? Number(f.get('assignee_id')) : null;
    const assignedMember = currentProjectMembers.find(m => m.id === assigneeId);

    const payload = isMember
      ? {
          description: f.get('description') || '',
          status: f.get('status')
        }
      : {
          title: f.get('title'),
          description: f.get('description') || '',
          status: f.get('status'),
          priority: f.get('priority'),
          deadline: f.get('deadline') || null,
          estimated_hours: Number(f.get('hours') || 4),
          assignee_id: assigneeId,
          assignee: assignedMember ? assignedMember.name : 'Unassigned',
          category: f.get('category') || selectedTask.category || 'Task',
          time_slot: f.get('time_slot') || selectedTask.time_slot || '11.00'
        };

    // Always update locally first
    const updatedTask = { ...selectedTask, ...payload, comments: selectedTask.comments || [] };
    setAllTasks(prev => prev.map(t => t.id === selectedTask.id ? updatedTask : t));
    sendChangeNotification(payload.title, `Detail tugas diperbarui (Status: ${statusMeta[payload.status]?.label || payload.status})`, assignedMember || selectedTask.assignee);
    notify('Tugas berhasil diperbarui');
    setModal('');
    setSelectedTask(null);

    // Try backend non-blocking (real JWT only)
    if (!demo && token) {
      try {
        const r = await api.patch(`/tasks/${selectedTask.id}`, payload);
        setAllTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...r.data, assignee: payload.assignee, comments: updatedTask.comments } : t));
      } catch {}
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!requireLogin(null, 'memberikan feedback atau komentar tugas')) return;
    if (!newCommentText.trim() || !selectedTask) return;

    // Gunakan nama user yang sedang login
    const commenterName = user?.name || 'Anggota Tim';
    // Role badge: Project Lead atau role spesifik anggota
    let commenterRole;
    if (isLead) {
      commenterRole = 'Project Lead';
    } else {
      const memberObj = currentProjectMembers.find(
        m => m.email?.toLowerCase() === user?.email?.toLowerCase()
      );
      commenterRole = memberObj?.role || 'Anggota';
    }

    const newComment = {
      id: 'cmt_' + Date.now(),
      author: commenterName,
      role: commenterRole,
      isLead: isLead,
      text: newCommentText.trim(),
      time: 'Baru saja'
    };

    const updatedComments = [...(selectedTask.comments || []), newComment];
    const updatedTask = { ...selectedTask, comments: updatedComments };

    setSelectedTask(updatedTask);
    setAllTasks(prev => prev.map(t => (t.id === selectedTask.id ? updatedTask : t)));
    setNewCommentText('');

    sendChangeNotification(
      selectedTask,
      `Feedback baru dari ${commenterName}: "${newComment.text.slice(0, 35)}..."`,
      selectedTask.assignee || commenterName
    );
    notify('Feedback tugas berhasil dikirim! 💬');
  };

  // ================= PROJECT ACTIONS =================

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!requireLogin(null, 'membuat project baru')) return;
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get('name'),
      description: f.get('description') || '',
      deadline: f.get('deadline') || null,
      theme: 'blue_campus'
    };

    // Always create locally first (works offline & for local accounts)
    const newP = { id: Date.now(), ...payload, owner_email: user?.email || '', owner_id: user?.id || null };
    const firstMember = {
      id: Date.now() + 1,
      project_id: newP.id,
      name: user?.name || 'Ketua Kelompok',
      role: 'Project Lead',
      email: user?.email || 'ketua@kampus.ac.id',
      initial: (user?.name || 'KT').slice(0, 2).toUpperCase(),
      bg: '#6366f1'
    };
    const updatedProjects = [newP, ...projects];
    const updatedMembers = [firstMember, ...allMembers];
    setProjects(updatedProjects);
    setAllMembers(updatedMembers);
    setActiveProjectId(newP.id);
    setActiveTab('dashboard');
    // Persist to localStorage so it survives refresh
    localStorage.setItem('tp_saved_projects', JSON.stringify(updatedProjects));
    localStorage.setItem('tp_saved_members', JSON.stringify(updatedMembers));
    localStorage.setItem('tp_saved_active_pid', String(newP.id));
    notify('Project baru berhasil dibuat!');

    // Also try to save to backend (non-blocking, for real JWT tokens)
    if (!demo && token) {
      try {
        const r = await api.post('/projects', payload);
        // Replace local project with backend one (has real id)
        setProjects(prev => prev.map(p => p.id === newP.id ? r.data : p));
        setActiveProjectId(r.data.id);
        const updatedMembersWithRealId = updatedMembers.map(m =>
          m.project_id === newP.id ? { ...m, project_id: r.data.id } : m
        );
        setAllMembers(updatedMembersWithRealId);
        localStorage.setItem('tp_saved_active_pid', String(r.data.id));
      } catch {
        // Backend save failed — local version still usable
      }
    }

    setModal('');
    setProjectDropdown(false);
  };

  const handleDeleteProject = (pToDelete, e) => {
    e.stopPropagation();
    if (!requireLogin(null, 'menghapus project')) return;
    // Open custom confirmation modal
    setDeleteProjectConfirm(pToDelete);
    setProjectDropdown(false);
  };

  const confirmDeleteProject = async () => {
    const pToDelete = deleteProjectConfirm;
    setDeleteProjectConfirm(null);
    if (!pToDelete) return;

    // Helper: clean localStorage
    const cleanLocalStorage = () => {
      try {
        const savedProj = localStorage.getItem('tp_saved_projects');
        if (savedProj) {
          const arr = JSON.parse(savedProj).filter(p => p.id !== pToDelete.id);
          localStorage.setItem('tp_saved_projects', JSON.stringify(arr));
        }
        const savedTasks = localStorage.getItem('tp_saved_tasks');
        if (savedTasks) {
          const arr = JSON.parse(savedTasks).filter(t => t.project_id !== pToDelete.id);
          localStorage.setItem('tp_saved_tasks', JSON.stringify(arr));
        }
        const savedMembers = localStorage.getItem('tp_saved_members');
        if (savedMembers) {
          const arr = JSON.parse(savedMembers).filter(m => m.project_id !== pToDelete.id);
          localStorage.setItem('tp_saved_members', JSON.stringify(arr));
        }
        const activePid = localStorage.getItem('tp_saved_active_pid');
        if (activePid && Number(activePid) === pToDelete.id) {
          localStorage.removeItem('tp_saved_active_pid');
        }
      } catch {}
    };

    // Always update local state immediately
    const nextProjects = projects.filter(p => p.id !== pToDelete.id);
    setProjects(nextProjects);
    setAllTasks(prev => prev.filter(t => t.project_id !== pToDelete.id));
    setAllMembers(prev => prev.filter(m => m.project_id !== pToDelete.id));
    if (activeProjectId === pToDelete.id) {
      const nextId = nextProjects[0]?.id || null;
      setActiveProjectId(nextId);
      if (nextId) {
        localStorage.setItem('tp_saved_active_pid', String(nextId));
      } else {
        localStorage.removeItem('tp_saved_active_pid');
      }
    }
    cleanLocalStorage();
    notify('Project berhasil dihapus');

    // Try to also delete from backend (non-blocking)
    if (!demo && token) {
      try {
        await api.delete(`/projects/${pToDelete.id}`);
      } catch {
        // Backend delete failed silently – state already cleaned
      }
    }
  };

  // ================= MEMBER ACTIONS =================

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!requireLogin(null, 'menambah anggota baru')) return;
    if (!currentProject) { notify('Pilih project terlebih dahulu'); return; }
    const f = new FormData(e.currentTarget);
    const memberEmail = (f.get('email') || '').toString().trim().toLowerCase();
    const newMember = {
      id: Date.now(),
      project_id: currentProject.id,
      name: f.get('name'),
      role: f.get('role'),
      email: memberEmail,
      initial: (f.get('name') || 'AN').slice(0, 2).toUpperCase(),
      bg: selectedColor
    };
    setAllMembers(prev => [...prev, newMember]);
    sendChangeNotification(newMember, `${newMember.name} ditambahkan ke kelompok sebagai ${newMember.role}`, newMember);
    notify(`${newMember.name} berhasil ditambahkan ke kelompok!`);
    setModal('');
    setSelectedColor(colorOptions[0].hex);

    // ===== SHARED STORE: simpan project + member agar anggota bisa login dan lihat =====
    // Ketika lead menambah anggota, simpan/update data project+member ke tp_shared_data
    // supaya anggota bisa akses saat login dengan email yang sama
    try {
      const sharedRaw = localStorage.getItem('tp_shared_data');
      const sharedData = sharedRaw ? JSON.parse(sharedRaw) : { projects: [], members: [], tasks: [] };
      // Update atau tambah project
      const pIdx = sharedData.projects.findIndex(p => p.id === currentProject.id);
      const pData = { ...currentProject, owner_email: user?.email || '', owner_id: user?.id || null };
      if (pIdx >= 0) sharedData.projects[pIdx] = pData;
      else sharedData.projects.push(pData);
      // Update atau tambah member baru
      const mIdx = sharedData.members.findIndex(m => m.id === newMember.id);
      if (mIdx < 0) sharedData.members.push(newMember);
      // Simpan semua members project ini
      const updatedMembersForProject = [...allMembers.filter(m => m.project_id === currentProject.id), newMember];
      updatedMembersForProject.forEach(m => {
        const idx = sharedData.members.findIndex(x => x.id === m.id);
        if (idx >= 0) sharedData.members[idx] = m;
        else sharedData.members.push(m);
      });
      localStorage.setItem('tp_shared_data', JSON.stringify(sharedData));
    } catch {}

    // Try backend non-blocking (real JWT only)
    if (!demo && token) {
      try {
        const r = await api.post(`/projects/${currentProject.id}/members`, { name: newMember.name, role: newMember.role, email: newMember.email });
        setAllMembers(prev => prev.map(m => m.id === newMember.id ? { ...r.data, initial: newMember.initial, bg: newMember.bg } : m));
      } catch {}
    }
  };

  const handleDeleteMember = async (memberToDelete) => {
    if (!requireLogin(null, 'menghapus anggota tim')) return;
    if (!confirm(`Hapus "${memberToDelete.name}" dari project ini?`)) return;
    // Always delete locally first
    setAllMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
    notify('Anggota tim dihapus');
    // Try backend non-blocking (real JWT only)
    if (!demo && token) {
      try { await api.delete(`/projects/${currentProject.id}/members/${memberToDelete.id}`); } catch {}
    }
  };

  // ================= AUTH ACTIONS =================

  const handleAuth = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const emailVal = (f.get('email') || '').toString().trim().toLowerCase();
    const passVal = (f.get('password') || '').toString();
    const nameVal = (f.get('name') || '').toString().trim();

    try {
      if (authMode === 'verify') {
        const r = await api.post('/auth/verify-email', {
          email: pendingCredentials.email,
          code: (f.get('code') || '').toString().trim()
        });
        localStorage.setItem('tp_token', r.data.access_token);
        localStorage.setItem('tp_user', JSON.stringify(r.data.user));
        setToken(r.data.access_token);
        setUser(r.data.user);
        setDemo(false);
        setModal('');
        setAuthModalPrompt('');
        notify('Email terverifikasi. Berhasil masuk!');
      } else if (authMode === 'login') {
        const r = await api.post('/auth/login', { email: emailVal, password: passVal });
        localStorage.setItem('tp_token', r.data.access_token);
        localStorage.setItem('tp_user', JSON.stringify(r.data.user));
        setToken(r.data.access_token);
        setUser(r.data.user);
        setDemo(false);
        setModal('');
        setAuthModalPrompt('');
        notify('Berhasil masuk ke akun!');
      } else {
        if (passVal.length < 8) {
          notify('Kata sandi minimal 8 karakter');
          return;
        }
        await api.post('/auth/register', { name: nameVal, email: emailVal, password: passVal });
        setPendingCredentials({ email: emailVal, password: passVal });
        setAuthMode('verify');
        notify('Kode verifikasi dikirim. Masukkan kode dari email Anda.');
      }
    } catch (apiErr) {
      if (apiErr.response?.status === 403 && authMode === 'login') {
        setPendingCredentials({ email: emailVal, password: passVal });
        setAuthMode('verify');
        notify('Email belum diverifikasi. Masukkan kode yang dikirim ke email Anda.');
      } else {
        notify(getApiErrorMessage(apiErr, 'Gagal memproses akun. Periksa koneksi backend.'));
      }
    }
  };

  const handleResendVerification = async () => {
    if (!pendingCredentials) return;
    try {
      const r = await api.post('/auth/verification/resend', pendingCredentials);
      notify(r.data.message);
    } catch (err) {
      notify(getApiErrorMessage(err, 'Gagal mengirim ulang kode verifikasi.'));
    }
  };

  // ================= VIEW SWITCHER (WELCOME & AUTH PAGES) =================
  if (currentView === 'welcome') {
    return (
      <WelcomeScreen
        onOpenWorkspace={() => setCurrentView('workspace')}
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPage
        initialMode={authInitialMode}
        customPrompt={authModalPrompt}
        onSuccess={(newUser, newToken) => {
          setUser(newUser);
          setToken(newToken);
          setDemo(false);
          setAuthModalPrompt('');
          setProjects([]);
          setActiveProjectId(null);
          setAllTasks([]);
          setAllMembers([]);
          setCurrentView('workspace');
          notify('Berhasil masuk ke akun!');
        }}
        onGoToLanding={() => setCurrentView('workspace')}
        onEnterDemo={() => {
          setDemo(true);
          setToken(null);
          setUser(null);
          setProjects([]);
          setActiveProjectId(null);
          setAllTasks([]);
          setAllMembers([]);
          setCurrentView('workspace');
          notify('Masuk sebagai Guest');
        }}
      />
    );
  }

  return (
    <div className="teamly-shell">
      {/* Sidebar backdrop for mobile */}
      {mobileMenu && (
        <div className="sidebar-backdrop" onClick={() => setMobileMenu(false)} />
      )}

      {/* Sidebar with Visible Text Labels */}
      <aside className={`teamly-sidebar ${mobileMenu ? 'open' : ''}`}>
        <div className="brand-header">
          <div className="brand-logo" onClick={() => setCurrentView('welcome')} title="Kembali ke Halaman Awal">
            <div className="brand-icon">
              <Rocket size={18} />
            </div>
            <span className="brand-name">Teamly</span>
            <span className="brand-badge">AI</span>
          </div>
          <button className="mobile-close-btn" onClick={() => setMobileMenu(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Project Selector Dropdown (THE ONLY PLACE FOR PROJECT LIST) - HIDDEN FOR GUEST */}
        {!isGuest && (
          <div className="sidebar-project-selector">
            <button
              className="project-selector-btn"
              onClick={() => setProjectDropdown(!projectDropdown)}
            >
              <div className="project-selector-info">
                <span className="project-selector-label">Project Aktif</span>
                <span className="project-selector-name">{currentProject?.name || 'Pilih Project'}</span>
              </div>
              <ChevronDown size={15} color="#94a3b8" />
            </button>

            {projectDropdown && (
              <div className="project-dropdown-menu">
                {projects.map(p => {
                  const pTasks = allTasks.filter(t => t.project_id === p.id);
                  const pDone = pTasks.filter(t => t.status === 'done').length;
                  const pPct = pTasks.length ? Math.round((pDone / pTasks.length) * 100) : 0;
                  const isActive = currentProject?.id === p.id;

                  return (
                    <div key={p.id} className={`project-dropdown-item ${isActive ? 'active' : ''}`}>
                      <button
                        className="project-item-btn"
                        onClick={() => {
                          setActiveProjectId(p.id);
                          setProjectDropdown(false);
                          setActiveTab('dashboard');
                        }}
                      >
                        <span className="item-title">{p.name}</span>
                        <span className="item-meta">{pTasks.length} tugas • {pPct}% selesai</span>
                      </button>
                      <button
                          className="item-delete-btn"
                          onClick={(e) => handleDeleteProject(p, e)}
                          title="Hapus project ini"
                        >
                          <Trash2 size={13} />
                        </button>
                    </div>
                  );
                })}
                <div className="project-dropdown-footer">
                  <button
                    className="dropdown-action-btn"
                    onClick={() => {
                      setActiveTab('generator');
                      setSurveyStep(1);
                      setProjectDropdown(false);
                    }}
                  >
                    <Lightbulb size={14} color="#ea580c" />
                    <span>Temukan Ide Project</span>
                  </button>
                  <button
                    className="dropdown-action-btn"
                    onClick={() => {
                      setModal('project');
                      setProjectDropdown(false);
                    }}
                  >
                    <Plus size={14} />
                    <span>Buat Project Manual</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sidebar Nav Items with TEXT */}
        <nav className="teamly-nav">
          <button
            className={`nav-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => { setActiveTab('generator'); setMobileMenu(false); }}
          >
            <Lightbulb size={18} />
            <span>Temukan Ide</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileMenu(false); }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tasks'); setMobileMenu(false); }}
          >
            <Kanban size={18} />
            <span>Papan Tugas</span>
            <span className="nav-counter">{stats.total - stats.counts.done}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => { setActiveTab('team'); setMobileMenu(false); }}
          >
            <Users size={18} />
            <span>Anggota Tim</span>
            <span className="nav-counter">{currentProjectMembers.length}</span>
          </button>
        </nav>

        {/* Sidebar Footer with Profile */}
        <div className="teamly-sidebar-footer">
          <div className="profile-pill">
            <div className="profile-avatar" style={{ background: isMember ? '#059669' : isLead ? '#ea580c' : '#6366f1' }}>
              {isGuest ? 'G' : (user?.name || 'A').slice(0, 1).toUpperCase()}
            </div>
            <div className="profile-text">
              <span className="profile-name">{isGuest ? 'Guest' : (user?.name || 'Admin Teamly')}</span>
              <span className="profile-sub">
                {isGuest ? 'Mode Lihat Saja' : (
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span>{user?.email || 'Email belum tersedia'}</span>
                    {!isGuest && (
                      <span style={{
                        fontSize: '10px', fontWeight: '700', letterSpacing: '0.3px',
                        color: isMember ? '#059669' : '#ea580c',
                        textTransform: 'uppercase'
                      }}>
                        {isMember ? '● Anggota' : '★ Project Lead'}
                      </span>
                    )}
                  </span>
                )}
              </span>
            </div>
            {isGuest ? (
              <button
                className="profile-login-btn"
                onClick={() => { setAuthInitialMode('login'); setCurrentView('auth'); }}
                title="Masuk ke Akun"
              >
                Masuk
              </button>
            ) : (
              <button className="profile-logout-btn" onClick={logout} title="Keluar">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Experience Layout */}
      <div className="teamly-main">
        {/* Topbar: Only Search Bar & Profile (NO burger menu, NO Survey/Tambah Tugas buttons) */}
        <header className="teamly-topbar">
          <div className="topbar-left">
            {/* Mobile hamburger button */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={20} />
            </button>
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-sub">Teamly Workspace</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'generator' && 'Temukan Ide'}
                {activeTab === 'tasks' && 'Papan Tugas'}
                {activeTab === 'team' && 'Anggota Tim'}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Live Interactive Search Bar with Instant Result Dropdown */}
            <div className="search-bar-wrap" style={{ position: 'relative' }}>
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Cari tugas di project ini..."
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}
                  title="Hapus pencarian"
                >
                  <X size={13} />
                </button>
              )}

              {/* Instant Search Results Dropdown */}
              {showSearchDropdown && searchQuery.trim().length > 0 && (
                <div className="search-results-dropdown">
                  <div className="search-dropdown-header">
                    <span>Hasil Pencarian Tugas</span>
                    <span className="results-count-badge">{searchMatches.length}</span>
                  </div>
                  <div className="search-dropdown-list">
                    {searchMatches.length === 0 ? (
                      <div className="search-empty-state">
                        Tidak ada tugas yang cocok dengan "{searchQuery}"
                      </div>
                    ) : (
                      searchMatches.map(t => (
                        <div
                          key={t.id}
                          className="search-result-item"
                          onClick={() => {
                            setSelectedTask(t);
                            setModal('edit_task');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="result-item-main">
                            <span className="result-item-title">{t.title}</span>
                            <div className="result-item-tags">
                              <span className={`result-status-badge ${t.status}`}>
                                {statusMeta[t.status]?.label || t.status}
                              </span>
                              {t.category && <span className="result-cat-tag">{t.category}</span>}
                              {t.assignee && (
                                <span className="result-assignee-tag">👤 {t.assignee}</span>
                              )}
                            </div>
                          </div>
                          <span className="result-action-hint">Buka &rarr;</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell with Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className="topbar-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifikasi aktivitas"
              >
                <Bell size={17} />
                {notifications.some(n => n.unread) && <span className="bell-dot" />}
              </button>

              {showNotifications && (
                <div className="notification-panel-dropdown">
                  <div className="notif-dropdown-header">
                    <div className="notif-header-title">Notifikasi Aktivitas</div>
                    <button className="notif-mark-read-btn" onClick={markAllNotificationsRead}>
                      Tandai Dibaca
                    </button>
                  </div>
                  <div className="notif-list-body">
                    {notifications.length === 0 ? (
                      <div className="notif-empty-box">Belum ada notifikasi aktivitas</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-card-item ${n.unread ? 'unread' : ''}`}>
                          <div className="notif-item-top">
                            <span className="notif-item-title">{n.title}</span>
                            <span className="notif-item-time">{n.time}</span>
                          </div>
                          <p className="notif-item-desc">{n.action}</p>
                          {n.taskTitle && (
                            <div className="notif-task-badge">
                              📌 {n.taskTitle}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="notif-dropdown-footer">
                    Aktivitas dan pembaruan tugas tim tersinkronisasi otomatis.
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar or Guest Login Button */}
            {isGuest ? (
              <button
                className="btn-topbar-login"
                onClick={() => { setAuthInitialMode('login'); setCurrentView('auth'); }}
              >
                Masuk
              </button>
            ) : (
              <div
                className="user-top-avatar"
                onClick={() => { setAuthInitialMode('login'); setCurrentView('auth'); }}
                title={user?.name || 'Pengguna'}
              >
                {(user?.name || 'M').slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Guest Mode Banner Notice */}
        {isGuest && (
          <div className="guest-compact-notice">
            <div className="guest-notice-left">
              <span className="guest-notice-pill">Guest</span>
              <span className="guest-notice-text">Mode lihat saja. Masuk untuk menambah & mengedit tugas.</span>
            </div>
            <button
              className="btn-guest-action"
              onClick={() => { setAuthInitialMode('login'); setCurrentView('auth'); }}
            >
              Masuk
            </button>
          </div>
        )}

        {/* ================= TAB 0: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <>
          {isMember && (
            <div className="page-container member-dashboard">
              <section className="member-dashboard-hero">
                <div>
                  <span className="member-dashboard-eyebrow"><CheckCircle2 size={14} /> RUANG KERJA ANGGOTA</span>
                  <h1>Halo, {user?.name?.split(' ')[0] || 'anggota'}!</h1>
                  <p>Ini ringkasan progres dan tugas yang menjadi tanggung jawab Anda di {currentProject?.name || 'project ini'}.</p>
                </div>
                <button className="btn-add-task" onClick={() => setActiveTab('tasks')}>
                  <Kanban size={15} /> Buka tugas saya
                </button>
              </section>

              <div className="member-dashboard-metrics">
                <article className="member-stat-card member-stat-total">
                  <span>Total tugas saya</span>
                  <strong>{stats.total}</strong>
                  <small>yang ditugaskan kepada Anda</small>
                </article>
                <article className="member-stat-card member-stat-active">
                  <span>Sedang dikerjakan</span>
                  <strong>{stats.counts.doing + stats.counts.review}</strong>
                  <small>termasuk tugas dalam review</small>
                </article>
                <article className="member-stat-card member-stat-done">
                  <span>Selesai</span>
                  <strong>{stats.counts.done}</strong>
                  <small>tugas yang sudah dituntaskan</small>
                </article>
                <article className={`member-stat-card ${stats.overdueCount ? 'member-stat-overdue' : 'member-stat-deadline'}`}>
                  <span>{stats.overdueCount ? 'Terlambat' : 'Perlu perhatian'}</span>
                  <strong>{stats.overdueCount || stats.highPriorityCount}</strong>
                  <small>{stats.overdueCount ? 'tugas melewati tenggat' : 'tugas prioritas tinggi'}</small>
                </article>
              </div>

              <div className="member-dashboard-content">
                <section className="panel-box member-my-tasks">
                  <div className="panel-box-header">
                    <div className="panel-title-wrap">
                      <Calendar size={16} color="#059669" />
                      <h2 className="panel-title">Tenggat tugas saya</h2>
                    </div>
                    <button className="btn-ghost-sm" onClick={() => setActiveTab('tasks')}>
                      Semua tugas <ArrowRight size={12} />
                    </button>
                  </div>
                  {upcomingTasks.length === 0 ? (
                    <div className="member-dashboard-empty">
                      <CheckCircle2 size={22} />
                      <span>Tidak ada tugas mendatang. Bagus, tetap pertahankan progresmu!</span>
                    </div>
                  ) : (
                    <div className="member-upcoming-list">
                      {upcomingTasks.slice(0, 5).map(task => (
                        <button
                          type="button"
                          className="member-upcoming-task"
                          key={task.id}
                          onClick={() => { setSelectedTask(task); setModal('edit_task'); }}
                        >
                          <span className={`member-task-status ${task.status}`} />
                          <span className="member-upcoming-title">{task.title}</span>
                          <span className={`member-upcoming-date ${task.deadline < new Date().toISOString().slice(0, 10) ? 'late' : ''}`}>
                            <Clock size={13} /> {task.deadline || 'Tanpa tenggat'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <aside className="panel-box member-progress-card">
                  <div className="panel-title-wrap">
                    <BarChart3 size={16} color="#059669" />
                    <h2 className="panel-title">Progres pribadi</h2>
                  </div>
                  <div className="member-progress-value">{stats.progress}%</div>
                  <div className="member-progress-track">
                    <div style={{ width: `${stats.progress}%` }} />
                  </div>
                  <p>{stats.counts.done} dari {stats.total} tugas selesai</p>
                  <div className="member-project-context">
                    <span>PROJECT AKTIF</span>
                    <strong>{currentProject?.name || 'Belum ada project'}</strong>
                    <small>Peran: {currentProjectMembers.find(m => m.email?.toLowerCase() === user?.email?.toLowerCase())?.role || 'Anggota'}</small>
                  </div>
                </aside>
              </div>
            </div>
          )}
          {!isMember && (
          <div className="page-container">
            {/* Header Row */}
            <div className="page-header-row">
              <div>
                <h1 className="page-main-title">{currentProject?.name || 'Dashboard'}</h1>
                <p className="page-main-sub">
                  {currentProject
                    ? `Tenggat: ${currentProject.deadline || 'Belum diatur'} • ${stats.progress}% selesai (${stats.counts.done} dari ${stats.total} tugas)`
                    : 'Tidak ada project. Buat project baru untuk memulai.'}
                </p>
              </div>

              {isLead && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-add-project"
                    onClick={() => requireLogin(() => setModal('project'), 'menambah project baru')}
                  >
                    <Plus size={15} />
                    <span>Tambah Project</span>
                  </button>
                  <button
                    className="btn-add-task"
                    onClick={() => requireLogin(() => setModal('task'), 'menambah tugas baru')}
                  >
                    <Plus size={15} />
                    <span>Tambah Tugas</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4 Counter Banner Cards */}
            <div className="metrics-banner-grid">
              {/* Card 1: Total Tugas */}
              <div className="metric-banner-card orange-theme">
                <div className="metric-card-top">
                  <span className="metric-pill-tag">Semua</span>
                  <span className="metric-sub-title">Total tugas aktif</span>
                </div>
                <div className="metric-card-main">
                  <div className="metric-text-stack">
                    <span className="metric-huge-val">{stats.total}</span>
                    <span className="metric-label-text">Total Tugas</span>
                  </div>
                  <div className="metric-art-box">
                    <TotalTasksIllustration />
                  </div>
                </div>
              </div>

              {/* Card 2: Sedang Dikerjakan */}
              <div className="metric-banner-card blue-theme">
                <div className="metric-card-top">
                  <span className="metric-pill-tag">Berjalan</span>
                  <span className="metric-sub-title">Sedang dikerjakan</span>
                </div>
                <div className="metric-card-main">
                  <div className="metric-text-stack">
                    <span className="metric-huge-val">{stats.counts.doing}</span>
                    <span className="metric-label-text">Sedang Dikerjakan</span>
                  </div>
                  <div className="metric-art-box">
                    <DoingTasksIllustration />
                  </div>
                </div>
              </div>

              {/* Card 3: Prioritas Tinggi */}
              <div className="metric-banner-card purple-theme">
                <div className="metric-card-top">
                  <span className="metric-pill-tag">Penting</span>
                  <span className="metric-sub-title">Perlu didahulukan</span>
                </div>
                <div className="metric-card-main">
                  <div className="metric-text-stack">
                    <span className="metric-huge-val">{stats.highPriorityCount}</span>
                    <span className="metric-label-text">Prioritas Tinggi</span>
                  </div>
                  <div className="metric-art-box">
                    <PriorityTasksIllustration />
                  </div>
                </div>
              </div>

              {/* Card 4: Terlambat / Tepat Waktu */}
              <div className={`metric-banner-card ${stats.overdueCount > 0 ? 'red-theme' : 'green-theme'}`}>
                <div className="metric-card-top">
                  <span className="metric-pill-tag">
                    {stats.overdueCount > 0 ? 'Perhatian' : 'Aman'}
                  </span>
                  <span className="metric-sub-title">
                    {stats.overdueCount > 0 ? 'Lewat dari tenggat' : 'Sesuai jadwal'}
                  </span>
                </div>
                <div className="metric-card-main">
                  <div className="metric-text-stack">
                    <span className="metric-huge-val">{stats.overdueCount}</span>
                    <span className="metric-label-text">Tugas Terlambat</span>
                  </div>
                  <div className="metric-art-box">
                    <OverdueTasksIllustration isOverdue={stats.overdueCount > 0} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Dashboard Content (No Insight Pembimbing AI, No Distribusi Status) */}
            <div className="dashboard-grid-layout">
              {/* Left Column: Upcoming Tasks & Timeline */}
              <div className="dash-left-col">
                {/* Upcoming Deadlines */}
                <div className="panel-box">
                  <div className="panel-box-header">
                    <div className="panel-title-wrap">
                      <Calendar size={16} color="#3b82f6" />
                      <h3 className="panel-title">Tenggat Waktu Terdekat</h3>
                    </div>
                    <button className="btn-ghost-sm" onClick={() => setActiveTab('tasks')}>
                      Lihat Papan <ArrowRight size={12} />
                    </button>
                  </div>

                  {upcomingTasks.length === 0 ? (
                    <div className="panel-empty-text">Belum ada tugas dengan tenggat waktu.</div>
                  ) : (
                    <div className="deadline-tasks-list">
                      {upcomingTasks.map(t => {
                        const isOverdue = t.deadline < new Date().toISOString().split('T')[0];
                        return (
                          <div className="deadline-task-row" key={t.id}>
                            <button
                              className={`task-check-circle ${t.status === 'done' ? 'checked' : ''}`}
                              onClick={() => toggleComplete(t)}
                              title="Tandai selesai"
                            >
                              {t.status === 'done' && <Check size={12} strokeWidth={3} />}
                            </button>
                            <div className="deadline-task-body">
                              <span
                                className="deadline-task-name"
                                onClick={() => { setSelectedTask(t); setModal('edit_task'); }}
                              >
                                {t.title}
                              </span>
                              <span className="deadline-task-meta">
                                {t.assignee || 'Unassigned'} • <span className={`priority-tag ${t.priority}`}>{t.priority}</span>
                              </span>
                            </div>
                            <span className={`deadline-tag ${isOverdue ? 'overdue' : ''}`}>
                              {isOverdue ? 'Terlambat: ' : ''}{t.deadline}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Timeline Schedule Track */}
                <div className="panel-box panel-timeline-box">
                  <div className="panel-box-header">
                    <div className="panel-title-wrap">
                      <Clock size={16} color="#10b981" />
                      <h3 className="panel-title">Jadwal & Timeline Hari Ini</h3>
                    </div>
                  </div>

                  {/* Horizontal Time Axis */}
                  <div className="timeline-axis-bar">
                    {timelineHours.map(hour => {
                      const isActive = hour === '14.00';
                      return (
                        <div className={`time-axis-node ${isActive ? 'active' : ''}`} key={hour}>
                          <span>{hour}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tasks on Canvas */}
                  <div className="timeline-chips-wrap">
                    {currentProjectTasks.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px', width: '100%' }}>
                        Belum ada jadwal tugas aktif.
                      </div>
                    ) : (
                      currentProjectTasks.slice(0, 4).map((t) => (
                        <div
                          key={t.id}
                          className={`timeline-chip ${t.status === 'doing' ? 'chip-active' : ''}`}
                          onClick={() => { setSelectedTask(t); setModal('edit_task'); }}
                        >
                          <div className="chip-left">
                            <span className="chip-category-text">{t.category || 'Tugas'}</span>
                            <span className="chip-name-text">{t.title}</span>
                          </div>
                          <div className="chip-user-bubble">
                            {(t.assignee || 'M').slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Habo-style Floating Add Button */}
                  <button
                    className="timeline-fab-btn"
                    onClick={() => requireLogin(() => setModal('task'), 'menambah tugas baru')}
                    title="Tambah aktivitas / tugas"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Right Column: Team Workload & Spotlight Workspace Card */}
              <div className="dash-right-col">
                {/* Team Workload */}
                <div className="panel-box">
                  <div className="panel-box-header">
                    <h3 className="panel-title">Beban Teman Kelompok</h3>
                    <button className="btn-ghost-sm" onClick={() => setModal('member')}>
                      <UserPlus size={13} /> + Teman
                    </button>
                  </div>

                  {currentProjectMembers.length === 0 ? (
                    <div className="panel-empty-text">Belum ada anggota tim.</div>
                  ) : (
                    <div className="member-workload-stack">
                      {currentProjectMembers.map(m => {
                        const activeCount = currentProjectTasks.filter(
                          t => (t.assignee_id === m.id || t.assignee === m.name) && t.status !== 'done'
                        ).length;
                        const pct = Math.min(100, (activeCount / 5) * 100);

                        return (
                          <div className="member-workload-row" key={m.id}>
                            <div className="workload-avatar" style={{ background: m.bg || '#6366f1' }}>
                              {m.initial || m.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="workload-info">
                              <span className="workload-name">{m.name}</span>
                              <span className="workload-role">{m.role}</span>
                            </div>
                            <div className="workload-meter-box">
                              <div className="workload-meter-bg">
                                <div className="workload-meter-fill" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="workload-count">{activeCount} tugas</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Spotlight Collab Preview Card */}
                <div className="spotlight-collab-card">
                  <div className="spotlight-collab-header">
                    <span className="spotlight-tag">WORKSPACE AKTIF</span>
                    <h4 className="spotlight-title">{currentProject?.name}</h4>
                    <p className="spotlight-desc">Pantau dan kelola sprint tugas kelompokmu secara teratur.</p>
                  </div>
                  <SpotlightCollabIllustration />
                  <button className="btn-spotlight-action" onClick={() => setActiveTab('tasks')}>
                    Buka Papan Tugas (Kanban)
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
          </>
        )}

        {/* ================= TAB 1: TEMUKAN IDE PROJECT ================= */}
        {activeTab === 'generator' && (
          <div className="page-container">
            {surveyStep < 7 ? (
              <div className="survey-single-page-wrap">
                {/* Survey Step Progress Bar */}
                <div className="survey-progress-header">
                  <div className="progress-info-row">
                    <span className="progress-step-text">Pertanyaan {surveyStep} dari 6</span>
                    <span className="progress-pct-text">{Math.round((surveyStep / 6) * 100)}%</span>
                  </div>
                  <div className="survey-progress-track">
                    <div className="survey-progress-fill" style={{ width: `${(surveyStep / 6) * 100}%` }} />
                  </div>
                </div>

                {/* Question Page 1: Bidang Minat */}
                {surveyStep === 1 && (
                  <div className="survey-question-card">
                    <div className="question-header">
                      <div className="question-badge">1</div>
                      <div>
                        <h2 className="question-title">Topik apa yang paling menarik buat kelompokmu?</h2>
                        <p className="question-sub">Pilih tema yang paling ingin kamu buatkan solusinya:</p>
                      </div>
                    </div>

                    <div className="survey-domain-grid">
                      {domainSurveyOptions.map(opt => {
                        const IconComp = opt.icon;
                        const isSelected = selectedDomain === opt.id;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            className={`survey-choice-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedDomain(opt.id)}
                          >
                            <div className={`choice-icon-wrap ${opt.colorClass}`}>
                              <IconComp size={22} />
                            </div>
                            <div className="choice-text-wrap">
                              <h4 className="choice-title">{opt.title}</h4>
                              <p className="choice-desc">{opt.desc}</p>
                            </div>
                            {isSelected && (
                              <div className="choice-check-dot">
                                <Check size={13} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Question Page 2: Target Platform */}
                {surveyStep === 2 && (
                  <div className="survey-question-card">
                    <div className="question-header">
                      <div className="question-badge">2</div>
                      <div>
                        <h2 className="question-title">Bentuk aplikasi apa yang ingin dibuat?</h2>
                        <p className="question-sub">Sesuaikan dengan arahan dosen atau kenyamanan timmu:</p>
                      </div>
                    </div>

                    <div className="survey-platform-grid">
                      {platformSurveyOptions.map(p => {
                        const isSelected = selectedPlatform === p.id;
                        const IconC = p.icon;
                        return (
                          <button
                            type="button"
                            key={p.id}
                            className={`survey-pill-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedPlatform(p.id)}
                          >
                            <IconC size={24} className="pill-icon" />
                            <span className="pill-title">{p.label}</span>
                            <span className="pill-sub">{p.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Question Page 3: Jumlah Anggota */}
                {surveyStep === 3 && (
                  <div className="survey-question-card">
                    <div className="question-header">
                      <div className="question-badge">3</div>
                      <div>
                        <h2 className="question-title">Berapa orang teman di kelompokmu?</h2>
                        <p className="question-sub">Pembagian tugas sprint akan disesuaikan dengan jumlah orang:</p>
                      </div>
                    </div>

                    <div className="survey-team-grid">
                      {teamSurveyOptions.map(t => {
                        const isSelected = selectedTeamSize === t.id;
                        return (
                          <button
                            type="button"
                            key={t.id}
                            className={`survey-team-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedTeamSize(t.id)}
                          >
                            <div className="team-card-icon">
                              <Users size={22} />
                            </div>
                            <span className="team-card-title">{t.label}</span>
                            <span className="team-card-sub">{t.sub}</span>
                            {isSelected && (
                              <div className="choice-check-dot">
                                <Check size={13} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Question Page 4: Target Waktu Pengerjaan */}
                {surveyStep === 4 && (
                  <div className="survey-question-card">
                    <div className="question-header">
                      <div className="question-badge">4</div>
                      <div>
                        <h2 className="question-title">Berapa target waktu pengerjaan yang kamu miliki?</h2>
                        <p className="question-sub">Pilih perkiraan waktu sebelum tugas harus dikumpulkan:</p>
                      </div>
                    </div>

                    <div className="survey-diff-list">
                      {durationSurveyOptions.map(dur => {
                        const isSelected = selectedDuration === dur.id;
                        return (
                          <button
                            type="button"
                            key={dur.id}
                            className={`survey-diff-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedDuration(dur.id)}
                          >
                            <div className="diff-card-text">
                              <span className="diff-card-title">{dur.label}</span>
                              <span className="diff-card-sub">{dur.sub}</span>
                            </div>
                            {isSelected && (
                              <div className="choice-check-dot">
                                <Check size={13} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Question Page 5: Tingkat Kesulitan */}
                {surveyStep === 5 && (
                  <div className="survey-question-card">
                    <div className="question-header">
                      <div className="question-badge">5</div>
                      <div>
                        <h2 className="question-title">Tingkat kesulitan apa yang cocok untuk timmu?</h2>
                        <p className="question-sub">Pilih gaya pengerjaan yang sesuai kemampuan bersama:</p>
                      </div>
                    </div>

                    <div className="survey-diff-list">
                      {difficultySurveyOptions.map(d => {
                        const isSelected = selectedDifficulty === d.id;
                        return (
                          <button
                            type="button"
                            key={d.id}
                            className={`survey-diff-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedDifficulty(d.id)}
                          >
                            <div className="diff-card-text">
                              <span className="diff-card-title">{d.label}</span>
                              <span className="diff-card-sub">{d.sub}</span>
                            </div>
                            {isSelected && (
                              <div className="choice-check-dot">
                                <Check size={13} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Question Page 6: Fitur Utama */}
                {surveyStep === 6 && (
                  <div className="survey-question-card">
                    <div className="question-header">
                      <div className="question-badge">6</div>
                      <div>
                        <h2 className="question-title">Fitur utama apa yang paling ingin kamu tonjolkan?</h2>
                        <p className="question-sub">Pilih satu fitur yang jadi fokus utama dalam penilaian tugasmu:</p>
                      </div>
                    </div>

                    <div className="survey-platform-grid">
                      {featureSurveyOptions.map(f => {
                        const isSelected = selectedKeyFeature === f.id;
                        const IconF = f.icon;
                        return (
                          <button
                            type="button"
                            key={f.id}
                            className={`survey-pill-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedKeyFeature(f.id)}
                          >
                            <IconF size={24} className="pill-icon" />
                            <span className="pill-title">{f.label}</span>
                            <span className="pill-sub">{f.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Survey Step Navigation Footer */}
                <div className="survey-step-footer">
                  {surveyStep > 1 ? (
                    <button
                      type="button"
                      className="btn-step-prev"
                      onClick={() => setSurveyStep(prev => prev - 1)}
                    >
                      <ArrowLeft size={16} />
                      <span>Sebelumnya</span>
                    </button>
                  ) : <div />}

                  {surveyStep < 6 ? (
                    <button
                      type="button"
                      className="btn-step-next"
                      onClick={() => setSurveyStep(prev => prev + 1)}
                    >
                      <span>Selanjutnya</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-step-submit"
                      onClick={handleRunSurveyAnalysis}
                      disabled={isAnalyzingIdeas}
                    >
                      {isAnalyzingIdeas ? (
                        <>
                          <LoaderCircle size={18} className="spin" />
                          <span>Menganalisis Rekomendasi Ide...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span>✨ Temukan Rekomendasi Ide</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Results Screen (Step 7) */
              <div className="survey-results-wrap">
                <div className="results-top-nav">
                  <div>
                    <h2 className="results-main-title">🎯 3 Rekomendasi Ide Project</h2>
                    <p className="results-main-sub">
                      Pilih ide yang paling kalian minati untuk langsung membuka workspace dan daftar tugas:
                    </p>
                  </div>
                  <button
                    className="btn-restart-survey"
                    onClick={() => { setSurveyStep(1); setGeneratedIdeas(null); }}
                  >
                    <RotateCcw size={14} />
                    <span>Ulangi Pertanyaan</span>
                  </button>
                </div>

                <div className="results-cards-row">
                  {(generatedIdeas || []).map((idea, index) => (
                    <div className="idea-rec-card" key={idea.id || index}>
                      <div className={`idea-banner-top ${idea.banner_theme || 'blue_campus'}`}>
                        <div className="banner-badge-tags">
                          <span className="badge-cat">{idea.category || selectedDomain}</span>
                          <span className="badge-diff">{idea.difficulty}</span>
                        </div>
                        <TechCollabIllustration theme={idea.banner_theme || 'blue_campus'} />
                      </div>

                      <div className="idea-body">
                        <h3 className="idea-title">{idea.name}</h3>
                        <div className="idea-tagline">{idea.tagline}</div>
                        <p className="idea-desc">{idea.description}</p>

                        <div className="idea-section-head">Fitur Utama:</div>
                        <ul className="idea-features-list">
                          {(idea.features || []).map((f, fi) => (
                            <li key={fi} className="feature-item">
                              <Check size={14} className="feature-check" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="idea-section-head">Teknologi:</div>
                        <div className="idea-tech-pills">
                          {(idea.tech_stack || []).map((tech, ti) => (
                            <span key={ti} className="tech-pill">{tech}</span>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="btn-select-idea"
                          onClick={() => handleSelectIdea(idea)}
                        >
                          <Rocket size={15} />
                          <span>Pilih Ide Ini & Buka Workspace</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: TASKS (KANBAN & LIST) ================= */}
        {activeTab === 'tasks' && (
          <div className="page-container">
            <div className="page-header-row">
              <div>
                <h1 className="page-main-title">{currentProject ? `Papan Tugas — ${currentProject.name}` : 'Papan Tugas'}</h1>
                <p className="page-main-sub">
                  {isMember ? 'Tugas yang diberikan ke Anda dalam project ini.' : 'Pantau alur pengerjaan tugas sprint kelompokmu secara real-time.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="view-toggle-wrap">
                  <button
                    className={`toggle-btn ${taskView === 'board' ? 'active' : ''}`}
                    onClick={() => setTaskView('board')}
                  >
                    <Kanban size={14} /> Papan
                  </button>
                  <button
                    className={`toggle-btn ${taskView === 'list' ? 'active' : ''}`}
                    onClick={() => setTaskView('list')}
                  >
                    <ListTodo size={14} /> Daftar
                  </button>
                </div>

                {isLead && (
                  <button
                    className="btn-add-task"
                    onClick={() => requireLogin(() => setModal('task'), 'menambah tugas baru')}
                  >
                    <Plus size={14} /> Tambah Tugas
                  </button>
                )}
              </div>
            </div>

            {/* Kanban Board View */}
            {taskView === 'board' && (
              <div className="kanban-columns-grid">
                {statusOrder.map((statusKey, colIndex) => {
                  const colTasks = filteredTasks.filter(t => t.status === statusKey);
                  return (
                    <div className="kanban-column-box" key={statusKey}>
                      <div className="column-head">
                        <div className="column-head-left">
                          <span className={`status-dot ${statusKey}`} />
                          <span className="column-title">{statusMeta[statusKey].label}</span>
                          <span className="column-count-badge">{colTasks.length}</span>
                        </div>
                        {isLead && (
                          <button
                            className="column-quick-add-btn"
                            onClick={() => requireLogin(() => { setSelectedTask({ status: statusKey }); setModal('task'); }, 'menambah tugas baru')}
                            title={`Tambah tugas ke ${statusMeta[statusKey].label}`}
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>

                      <div className="column-cards-stack">
                        {colTasks.length === 0 ? (
                          <div className="column-empty-state">
                            <div className="empty-dash-icon">
                              <CheckCircle2 size={24} />
                            </div>
                            <span>Belum ada tugas di tahap ini</span>
                          </div>
                        ) : (
                          colTasks.map(t => {
                            const isOverdue = t.deadline && t.deadline < new Date().toISOString().split('T')[0] && t.status !== 'done';
                            return (
                              <div className={`kanban-card-item ${t.status === 'done' ? 'card-done' : ''}`} key={t.id}>
                                <div className="card-item-top">
                                  <div className="card-top-tags">
                                    {t.category && <span className="card-cat-badge">{t.category}</span>}
                                    <span className={`priority-pill ${t.priority}`}>{t.priority}</span>
                                  </div>
                                  <button
                                    className={`card-check-round ${t.status === 'done' ? 'checked' : ''}`}
                                    onClick={() => toggleComplete(t)}
                                    title={t.status === 'done' ? 'Kembalikan ke belum selesai' : 'Tandai selesai'}
                                  >
                                    {t.status === 'done' && <Check size={11} strokeWidth={3} />}
                                  </button>
                                </div>

                                <h4
                                  className="card-item-title"
                                  onClick={() => { setSelectedTask(t); setModal('edit_task'); }}
                                >
                                  {t.title}
                                </h4>
                                {t.description && <p className="card-item-desc">{t.description}</p>}

                                <div className="card-item-foot">
                                  <div className="card-assignee">
                                    <div className="card-user-circle">
                                      {(!t.assignee || t.assignee === 'Unassigned') ? '?' : t.assignee.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="card-user-name">
                                      {(!t.assignee || t.assignee === 'Unassigned') ? 'Belum Ditugaskan' : t.assignee}
                                    </span>
                                  </div>
                                  {t.comments && t.comments.length > 0 && (
                                    <span className="card-comments-pill" title={`${t.comments.length} feedback/diskusi`}>
                                      <MessageSquare size={11} /> {t.comments.length}
                                    </span>
                                  )}
                                  {t.deadline && (
                                    <div className={`card-deadline ${isOverdue ? 'overdue' : ''}`}>
                                      <Calendar size={12} />
                                      <span>{t.deadline}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="card-action-bar">
                                  {isLead && (
                                    <div className="card-arrows-wrap">
                                      {colIndex > 0 && (
                                        <button
                                          className="card-nav-btn"
                                          onClick={() => moveTaskStatus(t, -1)}
                                          title="Pindah ke tahap sebelumnya"
                                        >
                                          <ArrowLeft size={12} />
                                        </button>
                                      )}
                                      {colIndex < statusOrder.length - 1 && (
                                        <button
                                          className="card-nav-btn"
                                          onClick={() => moveTaskStatus(t, 1)}
                                          title="Pindah ke tahap berikutnya"
                                        >
                                          <ArrowRight size={12} />
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  <div className="card-icons-wrap">
                                    <button
                                      className="card-action-icon"
                                      onClick={() => { setSelectedTask(t); setModal('edit_task'); }}
                                      title={isMember ? 'Lihat detail & beri feedback' : 'Edit tugas'}
                                    >
                                      {isMember ? <MessageSquare size={12} /> : <Edit2 size={12} />}
                                    </button>
                                    {isLead && (
                                      <button
                                        className="card-action-icon del"
                                        onClick={() => deleteTask(t)}
                                        title="Hapus tugas"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List Table View */}
            {taskView === 'list' && (
              <div className="table-wrapper-box">
                <table className="clean-task-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Nama Tugas</th>
                      <th>Penanggung Jawab</th>
                      <th>Prioritas</th>
                      <th>Tenggat</th>
                      <th>Status</th>
                      <th style={{ width: '70px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          Tidak ada tugas yang cocok dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map(t => (
                        <tr key={t.id}>
                          <td>
                            <button
                              className={`card-check-round ${t.status === 'done' ? 'checked' : ''}`}
                              onClick={() => toggleComplete(t)}
                            >
                              {t.status === 'done' && <Check size={11} strokeWidth={3} />}
                            </button>
                          </td>
                          <td>
                            <div
                              style={{ fontWeight: 600, cursor: 'pointer' }}
                              onClick={() => { setSelectedTask(t); setModal('edit_task'); }}
                            >
                              {t.title}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{(!t.assignee || t.assignee === 'Unassigned') ? 'Belum Ditugaskan' : t.assignee}</span>
                              {t.comments && t.comments.length > 0 && (
                                <span className="card-comments-pill" title={`${t.comments.length} feedback/diskusi`}>
                                  <MessageSquare size={10} /> {t.comments.length}
                                </span>
                              )}
                            </div>
                          </td>
                          <td><span className={`priority-pill ${t.priority}`}>{t.priority}</span></td>
                          <td>{t.deadline || '—'}</td>
                          <td>
                            <select
                              className="status-dropdown-select"
                              value={t.status}
                              onChange={e => changeTaskStatus(t, e.target.value)}
                            >
                              <option value="todo">Belum Mulai</option>
                              <option value="doing">Dikerjakan</option>
                              <option value="review">Review</option>
                              <option value="done">Selesai</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="card-action-icon" onClick={() => { setSelectedTask(t); setModal('edit_task'); }}>
                                <Edit2 size={13} />
                              </button>
                              <button className="card-action-icon del" onClick={() => deleteTask(t)}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: TEAM MEMBERS ================= */}
        {activeTab === 'team' && (
          <div className="page-container">
            <div className="page-header-row">
              <div>
                <h1 className="page-main-title">{currentProject ? `Anggota Tim — ${currentProject.name}` : 'Anggota Tim'}</h1>
                <p className="page-main-sub">
                  Atur peran dan pembagian beban tugas kuliah secara adil.
                </p>
              </div>
              <button
                className="btn-add-task"
                onClick={() => requireLogin(() => setModal('member'), 'menambah anggota kelompok')}
              >
                <UserPlus size={14} /> Tambah Teman Kelompok
              </button>
            </div>

            {currentProjectMembers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>
                <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p style={{ fontWeight: 600, fontSize: '14px', margin: 0, color: '#475569' }}>Belum ada anggota tim terdaftar</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Masuk ke akun untuk menambah atau mengelola anggota kelompok.</p>
              </div>
            ) : (
              <div className="team-cards-grid">
              {currentProjectMembers.map(m => {
                const activeCount = currentProjectTasks.filter(
                  t => (t.assignee_id === m.id || t.assignee === m.name) && t.status !== 'done'
                ).length;

                return (
                  <div className="member-card-box" key={m.id}>
                    <div className="member-card-upper">
                      <div className="member-round-avatar" style={{ background: m.bg || '#6366f1' }}>
                        {m.initial || m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="member-info-col">
                        <h4 className="member-full-name">{m.name}</h4>
                        <span className="member-role-badge">{m.role}</span>
                        {m.email && <span className="member-email-text">{m.email}</span>}
                      </div>
                    </div>

                    <div className="member-card-lower">
                      <span className="member-tasks-pill">{activeCount} tugas aktif</span>
                      <button
                        className="card-action-icon del"
                        onClick={() => handleDeleteMember(m)}
                        title="Hapus anggota"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      </div>

      {/* ================= MODALS ================= */}

      {/* Modal: Add Task */}
      {modal === 'task' && (
        <div className="modal-overlay" onClick={() => setModal('')}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tambah Tugas Baru ({currentProject?.name})</h3>
              <button className="modal-close-btn" onClick={() => setModal('')}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Nama Tugas *</label>
                <input
                  name="title"
                  className="form-input"
                  required
                  placeholder="Contoh: Implementasi checkout pesanan"
                  autoFocus
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <input
                    name="category"
                    className="form-input"
                    placeholder="Contoh: Frontend, Backend, UI/UX"
                    defaultValue="Frontend"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Slot Waktu (Jadwal)</label>
                  <select name="time_slot" className="form-select" defaultValue="11.00">
                    {timelineHours.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Prioritas</label>
                  <select name="priority" className="form-select" defaultValue="medium">
                    <option value="high">Tinggi</option>
                    <option value="medium">Sedang</option>
                    <option value="low">Rendah</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Penanggung Jawab</label>
                  <select name="assignee_id" className="form-select">
                    <option value="">Belum Ditugaskan</option>
                    {currentProjectMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Tenggat Waktu</label>
                  <input name="deadline" type="date" className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Status Awal</label>
                  <select name="status" className="form-select" defaultValue="todo">
                    <option value="todo">Belum Mulai</option>
                    <option value="doing">Dikerjakan</option>
                    <option value="review">Review</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Pekerjaan</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Catatan detail pengerjaan..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModal('')}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Task */}
      {modal === 'edit_task' && selectedTask && (
        <div className="modal-overlay" onClick={() => { setModal(''); setSelectedTask(null); }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Tugas</h3>
              <button className="modal-close-btn" onClick={() => { setModal(''); setSelectedTask(null); }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateTask}>
              <div className="form-group">
                <label className="form-label">Nama Tugas *</label>
                <input
                  name="title"
                  className="form-input"
                  required
                  defaultValue={selectedTask.title}
                  autoFocus
                  disabled={isMember}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <input
                    name="category"
                    className="form-input"
                    defaultValue={selectedTask.category || 'Frontend'}
                    disabled={isMember}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Slot Waktu</label>
                  <select name="time_slot" className="form-select" defaultValue={selectedTask.time_slot || '11.00'} disabled={isMember}>
                    {timelineHours.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Prioritas</label>
                  <select name="priority" className="form-select" defaultValue={selectedTask.priority} disabled={isMember}>
                    <option value="high">Tinggi</option>
                    <option value="medium">Sedang</option>
                    <option value="low">Rendah</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Penanggung Jawab</label>
                  <select name="assignee_id" className="form-select" defaultValue={selectedTask.assignee_id || ''} disabled={isMember}>
                    <option value="">Belum Ditugaskan</option>
                    {currentProjectMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Tenggat Waktu</label>
                  <input
                    name="deadline"
                    type="date"
                    className="form-input"
                    defaultValue={selectedTask.deadline || ''}
                    disabled={isMember}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-select" defaultValue={selectedTask.status}>
                    <option value="todo">Belum Mulai</option>
                    <option value="doing">Dikerjakan</option>
                    <option value="review">Review</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  defaultValue={selectedTask.description || ''}
                />
              </div>

              {/* Task Comments & Member Feedback Section */}
              <div className="task-comments-section">
                <div className="task-comments-header">
                  <div className="task-comments-title">
                    <MessageSquare size={15} color="#ea580c" />
                    <span>Feedback & Diskusi Tugas</span>
                    <span className="comments-count-pill">
                      {(selectedTask.comments || []).length}
                    </span>
                  </div>
                </div>

                <div className="task-comments-list">
                  {(selectedTask.comments || []).length === 0 ? (
                    <div className="task-comments-empty">
                      Belum ada feedback untuk tugas ini. Anggota yang ditugaskan dapat menambahkan catatan atau progres di bawah.
                    </div>
                  ) : (
                    (selectedTask.comments || []).map((c) => (
                      <div className="comment-item-card" key={c.id}>
                        <div className="comment-header-row">
                          <div className="comment-author-badge">
                            <div className="comment-avatar-bubble">
                              {(c.author || 'A').slice(0, 1).toUpperCase()}
                            </div>
                            <span className="comment-author-name">{c.author}</span>
                            {c.role && <span className="comment-role-tag">{c.role}</span>}
                          </div>
                          <span className="comment-timestamp">{c.time}</span>
                        </div>
                        <p className="comment-text-body">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="comment-input-wrap">
                  <input
                    type="text"
                    className="comment-text-input"
                    placeholder="Tulis feedback atau update tugas..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddComment(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-send-comment"
                    disabled={!newCommentText.trim()}
                    onClick={handleAddComment}
                  >
                    <span>Kirim</span>
                  </button>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => { setModal(''); setSelectedTask(null); }}
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Perbarui Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Team Member */}
      {modal === 'member' && (
        <div className="modal-overlay" onClick={() => setModal('')}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tambah Teman Kelompok ({currentProject?.name})</h3>
              <button className="modal-close-btn" onClick={() => setModal('')}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap Teman *</label>
                <input
                  name="name"
                  className="form-input"
                  required
                  placeholder="Contoh: Hendra Wijaya"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Peran / Tanggung Jawab *</label>
                <input
                  name="role"
                  className="form-input"
                  required
                  placeholder="Contoh: Frontend Developer, UI Designer, QA Tester"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Kampus (Opsional)</label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="hendra@kampus.ac.id"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Warna Avatar</label>
                <div className="color-options-row">
                  {colorOptions.map(c => (
                    <button
                      type="button"
                      key={c.hex}
                      className={`color-dot-btn ${selectedColor === c.hex ? 'selected' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setSelectedColor(c.hex)}
                      title={c.label}
                    >
                      {selectedColor === c.hex && <Check size={14} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModal('')}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Tambahkan ke Kelompok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Project (Manual) */}
      {modal === 'project' && (
        <div className="modal-overlay" onClick={() => setModal('')}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Buat Project Tugas Kuliah Baru</h3>
              <button className="modal-close-btn" onClick={() => setModal('')}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Nama Project *</label>
                <input
                  name="name"
                  className="form-input"
                  required
                  placeholder="Contoh: Sistem Informasi Praktikum Kampus"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Batas Pengumpulan (Deadline)</label>
                <input name="deadline" type="date" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Singkat</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Cakupan dan target project..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModal('')}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Buat Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Auth (Login / Register) */}
      {modal === 'auth' && (
        <div className="modal-overlay" onClick={() => setModal('')}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {authMode === 'verify' ? 'Verifikasi Email' : authMode === 'login' ? 'Masuk ke Teamly' : 'Daftar Akun Teamly'}
              </h3>
              <button className="modal-close-btn" onClick={() => { setModal(''); setAuthModalPrompt(''); }}>
                <X size={18} />
              </button>
            </div>
            {authModalPrompt && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px', lineHeight: '1.4' }}>
                🔒 {authModalPrompt}
              </div>
            )}
            <form onSubmit={handleAuth}>
              {authMode === 'verify' && (
                <>
                  <input type="hidden" name="email" value={pendingCredentials?.email || ''} />
                  <div className="form-group">
                    <label className="form-label">Kode Verifikasi Email</label>
                    <input
                      name="code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      className="form-input"
                      required
                      placeholder="Masukkan kode 6 digit"
                    />
                  </div>
                </>
              )}
              {authMode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input name="name" className="form-input" required placeholder="Nama Anda" />
                </div>
              )}

              {authMode !== 'verify' && <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-input" required placeholder="nama@kampus.ac.id" />
              </div>}

              {authMode !== 'verify' && <div className="form-group">
                <label className="form-label">Password</label>
                <input name="password" type="password" minLength={8} className="form-input" required placeholder="Minimal 8 karakter" />
              </div>}

              <div className="modal-actions" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  {authMode === 'verify' ? 'Verifikasi dan Masuk' : authMode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
                </button>
                {authMode === 'verify' ? (
                  <>
                    <button type="button" className="btn-link" onClick={handleResendVerification}>
                      Kirim ulang kode
                    </button>
                    <button type="button" className="btn-link" onClick={() => setAuthMode('login')}>
                      Kembali ke masuk
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  >
                    {authMode === 'login' ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <nav className="mobile-bottom-nav">
        <button
          type="button"
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          className={`mobile-nav-item ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => { setActiveTab('generator'); setSurveyStep(1); }}
        >
          <Lightbulb size={20} />
          <span>Ide AI</span>
        </button>
        <button
          type="button"
          className={`mobile-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <Kanban size={20} />
          <span>Tugas</span>
        </button>
        <button
          type="button"
          className={`mobile-nav-item ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={20} />
          <span>Tim</span>
        </button>
      </nav>

      {/* Modal: Konfirmasi Hapus Project */}
      {deleteProjectConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteProjectConfirm(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '360px',
              padding: '28px 24px 24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Close btn */}
            <button
              onClick={() => setDeleteProjectConfirm(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#f3f4f6', border: 'none', borderRadius: '50%',
                width: '30px', height: '30px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6b7280',
              }}
            >
              <X size={15} />
            </button>

            {/* Icon */}
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Trash2 size={26} color="#dc2626" />
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>
              Hapus Project?
            </h3>

            {/* Project name */}
            <div style={{
              background: '#f9fafb', border: '1px solid #e5e7eb',
              borderRadius: '10px', padding: '10px 16px', margin: '4px 0 12px',
              width: '100%', boxSizing: 'border-box',
            }}>
              <span style={{ fontWeight: '600', fontSize: '13px', color: '#374151' }}>
                {deleteProjectConfirm.name}
              </span>
            </div>

            {/* Warning text */}
            <p style={{ fontSize: '12.5px', color: '#9ca3af', lineHeight: '1.5', margin: '0 0 20px' }}>
              Semua tugas & anggota akan ikut terhapus dan tidak bisa dikembalikan.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                onClick={() => setDeleteProjectConfirm(null)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '12px',
                  background: '#f3f4f6', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '13.5px', color: '#374151',
                }}
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteProject}
                style={{
                  flex: 1, padding: '11px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '13.5px', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 14px rgba(220,38,38,0.35)',
                }}
              >
                <Trash2 size={13} />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <CheckCircle2 size={16} color="#34d399" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
