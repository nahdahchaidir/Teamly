import React, { useState } from 'react';
import {
  Rocket,
  ArrowLeft,
  Mail,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle
} from 'lucide-react';
import api from './api';

export default function AuthPage({
  initialMode = 'login',
  onSuccess,
  onGoToLanding,
  onEnterDemo
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Mahasiswa Teknik Informatika');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('tp_token', res.data.access_token);
        localStorage.setItem('tp_user', JSON.stringify(res.data.user));
        onSuccess(res.data.user, res.data.access_token);
      } else {
        if (password.length < 8) {
          setErrorMsg('Password minimal 8 karakter');
          setLoading(false);
          return;
        }
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('tp_token', res.data.access_token);
        localStorage.setItem('tp_user', JSON.stringify(res.data.user));
        onSuccess(res.data.user, res.data.access_token);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Gagal melakukan autentikasi. Silakan periksa data Anda.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrap">
      {/* Top Navigation */}
      <div className="auth-top-nav">
        <button className="btn-back-landing" onClick={onGoToLanding}>
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="auth-brand" onClick={onGoToLanding}>
          <div className="brand-icon-orange small">
            <Rocket size={15} color="white" />
          </div>
          <span className="brand-text">Teamly</span>
          <span className="brand-badge-ai">AI</span>
        </div>
      </div>

      <div className="auth-card-container">
        {/* Left Side: Brand Visual Card (Desktop) */}
        <div className="auth-visual-side">
          <div className="visual-top-badge">
            <Sparkles size={14} />
            <span>Workspace Mahasiswa Pintar</span>
          </div>

          <h2 className="visual-heading">
            Selesaikan Tugas Kuliah Kelompok Lebih Cepat & Rapi.
          </h2>

          <p className="visual-sub">
            Bergabunglah dengan ribuan mahasiswa lainnya untuk merumuskan ide inovatif,
            mengatur sprint tugas secara adil, dan memantau deadline tanpa drama.
          </p>

          <div className="visual-perks-list">
            <div className="perk-item">
              <CheckCircle2 size={16} className="perk-icon" />
              <span>Rekomendasi 3 ide proyek otomatis dengan AI</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={16} className="perk-icon" />
              <span>Papan tugas Kanban & visualisasi timeline harian</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={16} className="perk-icon" />
              <span>Transparansi beban kerja per teman sekelompok</span>
            </div>
          </div>

          {/* Student Quote Box */}
          <div className="visual-quote-box">
            <p className="quote-text">
              "Idenya langsung di-ACC dosen dan pembagian tugasnya adil banget di Kanban!"
            </p>
            <div className="quote-author">
              <div className="quote-avatar">NP</div>
              <div>
                <span className="q-name">Nadia Putri</span>
                <span className="q-sub">Teknik Informatika</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-form-side">
          {/* Mode Switch Tabs */}
          <div className="auth-tabs-row">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrorMsg(''); }}
            >
              Masuk ke Akun
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrorMsg(''); }}
            >
              Daftar Akun Baru
            </button>
          </div>

          <div className="auth-form-header">
            <h3 className="auth-form-title">
              {mode === 'login' ? 'Selamat Datang Kembali 👋' : 'Mulai Bersama Teamly 🚀'}
            </h3>
            <p className="auth-form-sub">
              {mode === 'login'
                ? 'Masukkan email dan password akun Teamly Anda.'
                : 'Buat akun gratis untuk mengelola tugas kelompok kuliahmu.'}
            </p>
          </div>

          {errorMsg && (
            <div className="auth-error-box">
              <AlertCircle size={16} className="text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-actual-form">
            {mode === 'register' && (
              <div className="auth-field-group">
                <label className="auth-field-label">Nama Lengkap</label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-field-icon" />
                  <input
                    type="text"
                    required
                    className="auth-text-input"
                    placeholder="Contoh: Nadia Putri"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="auth-field-group">
              <label className="auth-field-label">Email Kampus / Pribadi</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-field-icon" />
                <input
                  type="email"
                  required
                  className="auth-text-input"
                  placeholder="nama@kampus.ac.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field-group">
              <div className="auth-label-row">
                <label className="auth-field-label">Kata Sandi</label>
                {mode === 'login' && (
                  <span className="auth-forgot-link" onClick={() => alert('Fitur reset kata sandi demo: Anda dapat masuk langsung via Tombol Tamu Demo.')}>
                    Lupa password?
                  </span>
                )}
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="auth-text-input"
                  placeholder={mode === 'register' ? 'Minimal 8 karakter' : 'Kata sandi Anda'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="auth-field-group">
                <label className="auth-field-label">Program Studi / Peran</label>
                <div className="auth-input-wrap">
                  <GraduationCap size={16} className="auth-field-icon" />
                  <input
                    type="text"
                    className="auth-text-input"
                    placeholder="Contoh: Teknik Informatika / UI-UX"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={18} className="spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Masuk ke Workspace' : 'Buat Akun Sekarang'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass Option */}
          <div className="auth-divider">
            <span className="divider-line" />
            <span className="divider-text">atau langsung akses</span>
            <span className="divider-line" />
          </div>

          <button
            type="button"
            className="btn-auth-demo"
            onClick={onEnterDemo}
          >
            <Sparkles size={16} color="#f97316" />
            <span>Masuk Mode Tamu (Coba Demo Langsung)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
