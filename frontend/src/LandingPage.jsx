import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Kanban,
  CheckCircle2,
  Users,
  Clock,
  Rocket,
  ShieldCheck,
  Zap,
  GraduationCap,
  ChevronRight,
  Laptop,
  Check,
  Star,
  MessageSquare,
  Compass,
  LayoutDashboard
} from 'lucide-react';

export default function LandingPage({ onOpenApp, onOpenAuth, onStartSurvey }) {
  return (
    <div className="landing-wrap">
      {/* ================= STICKY NAVBAR ================= */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-icon-orange">
              <Rocket size={18} color="white" />
            </div>
            <span className="brand-text">Teamly</span>
            <span className="brand-badge-ai">AI</span>
          </div>

          <nav className="landing-links">
            <a href="#fitur" className="nav-link">Fitur</a>
            <a href="#cara-kerja" className="nav-link">Cara Kerja</a>
            <a href="#ai-survey" className="nav-link">AI Ide Generator</a>
            <a href="#testimoni" className="nav-link">Testimoni</a>
          </nav>

          <div className="landing-nav-actions">
            <button className="btn-nav-login" onClick={() => onOpenAuth('login')}>
              Masuk
            </button>
            <button className="btn-nav-primary" onClick={onOpenApp}>
              <span>Buka Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-pill-tag">
            <Sparkles size={14} className="tag-sparkle" />
            <span>Platform Kolaborasi & Generator Ide Tugas Kuliah No. 1</span>
          </div>

          <h1 className="hero-title">
            Bikin Tugas Proyek Kuliah Jadi Ringan, Terarah & <span className="highlight-orange">Bebas Bingung Ide.</span>
          </h1>

          <p className="hero-subtitle">
            Dari nol ide hingga pembagian tugas kelompok yang adil. Teamly memandu mahasiswa merumuskan
            konsep proyek berbasis AI, mengorganisir papan Kanban, dan memonitor deadline dalam satu workspace rapi.
          </p>

          <div className="hero-cta-group">
            <button className="btn-hero-primary" onClick={onStartSurvey}>
              <Sparkles size={18} />
              <span>Mulai Survey Ide AI (Gratis)</span>
            </button>
            <button className="btn-hero-secondary" onClick={onOpenApp}>
              <LayoutDashboard size={18} />
              <span>Coba Demo Workspace</span>
            </button>
          </div>

          <div className="hero-trust-bar">
            <div className="trust-item">
              <GraduationCap size={16} color="#f97316" />
              <span>Ramah Mahasiswa Kampus</span>
            </div>
            <div className="trust-sep">•</div>
            <div className="trust-item">
              <Zap size={16} color="#f97316" />
              <span>Rekomendasi AI Instan 10 Detik</span>
            </div>
            <div className="trust-sep">•</div>
            <div className="trust-item">
              <Users size={16} color="#f97316" />
              <span>Beban Tugas Kelompok Adil</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive App Preview */}
        <div className="hero-preview-container">
          <div className="app-preview-card">
            <div className="preview-top-bar">
              <div className="preview-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="preview-url-bar">
                <span>teamly.app/workspace/sprint-kuliah</span>
              </div>
            </div>

            <div className="preview-body">
              {/* Mini Topbar */}
              <div className="mini-topbar">
                <div className="mini-brand">
                  <div className="mini-brand-dot" />
                  <span>Teamly Workspace — KantinGo Pre-Order</span>
                </div>
                <div className="mini-user-badge">NP</div>
              </div>

              {/* Mini 3 Metric Cards with Orange / Blue / Purple */}
              <div className="mini-metric-grid">
                <div className="mini-card orange">
                  <div className="mini-card-tag">Total Tugas</div>
                  <div className="mini-card-val">5 Tugas</div>
                  <div className="mini-card-sub">Sprint Aktif</div>
                </div>
                <div className="mini-card blue">
                  <div className="mini-card-tag">Sedang Dikerjakan</div>
                  <div className="mini-card-val">2 Tugas</div>
                  <div className="mini-card-sub">Fokus Utama</div>
                </div>
                <div className="mini-card purple">
                  <div className="mini-card-tag">Prioritas Tinggi</div>
                  <div className="mini-card-val">3 Tugas</div>
                  <div className="mini-card-sub">Urgent Sprint</div>
                </div>
              </div>

              {/* Mini Timeline Mock */}
              <div className="mini-timeline-bar">
                <div className="mini-timeline-head">
                  <span>Jadwal Sprint Hari Ini</span>
                  <span className="mini-tag">14.00 Aktif</span>
                </div>
                <div className="mini-tasks-row">
                  <div className="mini-task-capsule active">
                    <span className="cat">Backend</span>
                    <span className="name">API Katalog Menu</span>
                  </div>
                  <div className="mini-task-capsule">
                    <span className="cat">UI/UX</span>
                    <span className="name">Wireframe Pesanan</span>
                  </div>
                  <div className="mini-task-capsule">
                    <span className="cat">Frontend</span>
                    <span className="name">Integrasi REST API</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROBLEMS & SOLUTIONS ================= */}
      <section className="landing-section" id="fitur">
        <div className="section-head">
          <span className="section-badge">SOLUSI MAHASISWA</span>
          <h2 className="section-title">Semua Masalah Tugas Kelompok, Ada Solusinya di Teamly.</h2>
          <p className="section-sub">
            Dirancang khusus untuk dinamika tugas kuliah rekayasa perangkat lunak, sistem informasi, dan proyek tim.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon orange">
              <Compass size={24} />
            </div>
            <h3 className="feature-card-title">Survey Ide AI (Anti-Buntu)</h3>
            <p className="feature-card-desc">
              Tidak tahu mau buat apa? AI memandu lewat survey 1-halaman interaktif dan langsung merekomendasikan
              3 konsep proyek matang beserta fitur dan tech stack-nya.
            </p>
            <div className="feature-check-list">
              <div className="f-check"><Check size={14} color="#f97316" /> <span>Rekomendasi spesifik bidang & platform</span></div>
              <div className="f-check"><Check size={14} color="#f97316" /> <span>Siap diajukan ke dosen pengampu</span></div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <Kanban size={24} />
            </div>
            <h3 className="feature-card-title">Papan Kanban & Timeline Rapi</h3>
            <p className="feature-card-desc">
              Atur status pengerjaan dari "Belum Mulai" hingga "Selesai". Tata letak rapi memudahkan tim
              melihat siapa yang sedang mengerjakan apa secara transparan.
            </p>
            <div className="feature-check-list">
              <div className="f-check"><Check size={14} color="#3b82f6" /> <span>Drag atau klik untuk pindah kolom</span></div>
              <div className="f-check"><Check size={14} color="#3b82f6" /> <span>Filter pencarian instan tugas</span></div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <Users size={24} />
            </div>
            <h3 className="feature-card-title">Beban Tim Transparan</h3>
            <p className="feature-card-desc">
              Hentikan drama kerja kelompok yang timpang! Meteran beban kerja otomatis menghitung jumlah
              tugas aktif per orang sehingga pembagian peran selalu seimbang.
            </p>
            <div className="feature-check-list">
              <div className="f-check"><Check size={14} color="#8b5cf6" /> <span>Visual meter kapasitas per anggota</span></div>
              <div className="f-check"><Check size={14} color="#8b5cf6" /> <span>Daftar peran & kontak email kampus</span></div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">
              <Rocket size={24} />
            </div>
            <h3 className="feature-card-title">AI Pembimbing Proyek</h3>
            <p className="feature-card-desc">
              Konsultasikan kendala teknis kapan saja. AI siap memberikan saran arsitektur basis data,
              struktur laporan tugas bab per bab, hingga panduan presentasi.
            </p>
            <div className="feature-check-list">
              <div className="f-check"><Check size={14} color="#10b981" /> <span>Prompt cepat untuk laporan tugas</span></div>
              <div className="f-check"><Check size={14} color="#10b981" /> <span>Analisis risiko keterlambatan tugas</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 STEPS SECTION ================= */}
      <section className="landing-section bg-soft" id="cara-kerja">
        <div className="section-head">
          <span className="section-badge">CARA KERJA</span>
          <h2 className="section-title">3 Langkah Mudah Dari Nol Sampai Siap Demo</h2>
          <p className="section-sub">
            Tanpa ribet instalasi atau konfigurasi rumit, langsung mulai dalam hitungan detik.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-num">1</div>
            <div className="step-content">
              <h4 className="step-title">Isi Survey Kebutuhan Kuliah</h4>
              <p className="step-desc">
                Jawab 4 pertanyaan ringkas tentang minat bidang (akademik, bisnis, lingkungan), format platform (web/mobile), dan ukuran tim.
              </p>
            </div>
          </div>

          <div className="step-arrow">
            <ChevronRight size={22} color="#cbd5e1" />
          </div>

          <div className="step-item">
            <div className="step-num">2</div>
            <div className="step-content">
              <h4 className="step-title">Pilih Konsep AI Terbaik</h4>
              <p className="step-desc">
                AI merumuskan 3 opsi ide proyek lengkap dengan fitur utama, tech stack, dan langsung membuat workspace tugas siap pakai.
              </p>
            </div>
          </div>

          <div className="step-arrow">
            <ChevronRight size={22} color="#cbd5e1" />
          </div>

          <div className="step-item">
            <div className="step-num">3</div>
            <div className="step-content">
              <h4 className="step-title">Kolaborasi di Kanban & Tuntaskan</h4>
              <p className="step-desc">
                Bagi tugas ke teman sekelompok, pantau deadline di timeline harian, dan tuntaskan proyek kuliahmu tepat waktu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="landing-section" id="testimoni">
        <div className="section-head">
          <span className="section-badge">TESTIMONI</span>
          <h2 className="section-title">Disukai Oleh Mahasiswa & Kelompok Proyek</h2>
          <p className="section-sub">
            Pengalaman nyata teman-teman mahasiswa yang berhasil menyelesaikan proyek kuliah bersama Teamly.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testi-card">
            <div className="testi-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p className="testi-text">
              "Biasanya diskusi judul proyek makan waktu 2 minggu sampai pusing. Pakai survey AI Teamly, 5 menit langsung dapat 3 opsi ide mantap yang disetujui dosen pembimbing!"
            </p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: '#f97316' }}>NP</div>
              <div>
                <span className="testi-name">Nadia Putri</span>
                <span className="testi-role">Mahasiswi Teknik Informatika, Sem 5</span>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div className="testi-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p className="testi-text">
              "Papan Kanban dan meteran beban tugasnya bikin pembagian tugas kelompok jadi adil. Nggak ada lagi drama anggota yang cuma numpang nama di laporan tugas akhir."
            </p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: '#3b82f6' }}>RP</div>
              <div>
                <span className="testi-name">Rizky Pratama</span>
                <span className="testi-role">Mahasiswa Sistem Informasi, Sem 6</span>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div className="testi-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <p className="testi-text">
              "Fitur AI Agile Coach-nya keren banget! Bisa ditanya struktur bab laporan dan rekomendasi REST API yang cocok untuk arsitektur tugas kelompok kami."
            </p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: '#10b981' }}>FR</div>
              <div>
                <span className="testi-name">Fajar Ramadhan</span>
                <span className="testi-role">Mahasiswa Ilmu Komputer, Sem 4</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA BANNER ================= */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <div className="cta-badge">GRATIS UNTUK MAHASISWA</div>
          <h2 className="cta-title">Siap Selesaikan Tugas Kuliahmu Lebih Cepat & Terstruktur?</h2>
          <p className="cta-sub">
            Bergabunglah dengan ribuan mahasiswa lainnya dan rasakan kemudahan mengelola proyek kuliah bersama Teamly.
          </p>
          <div className="cta-actions">
            <button className="btn-cta-main" onClick={onOpenApp}>
              <span>Buka Workspace Sekarang</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn-cta-auth" onClick={() => onOpenAuth('register')}>
              <span>Daftar Akun Gratis</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-brand">
              <div className="brand-icon-orange small">
                <Rocket size={14} color="white" />
              </div>
              <span className="footer-brand-text">Teamly</span>
              <span className="brand-badge-ai">AI</span>
            </div>
            <p className="footer-copy">
              Platform kolaborasi dan pembuat keputusan ide proyek kuliah berbasis AI.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h5 className="footer-col-title">Produk</h5>
              <a href="#fitur">Papan Kanban</a>
              <a href="#cara-kerja">Timeline Sprint</a>
              <a href="#ai-survey">Survey Ide AI</a>
            </div>
            <div className="footer-col">
              <h5 className="footer-col-title">Navigasi</h5>
              <button className="footer-link-btn" onClick={onOpenApp}>Buka Workspace</button>
              <button className="footer-link-btn" onClick={() => onOpenAuth('login')}>Masuk</button>
              <button className="footer-link-btn" onClick={() => onOpenAuth('register')}>Daftar</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Teamly AI — Didesain dengan penuh perhatian untuk mahasiswa & tim kolaboratif.</span>
        </div>
      </footer>
    </div>
  );
}
