import React, { useState } from 'react';
import {
  Rocket,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import api from './api';

export default function AuthPage({
  initialMode = 'login',
  onSuccess,
  onGoToLanding,
  onEnterDemo,
  customPrompt = ''
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Admin login
    if (mode === 'login' && cleanEmail === 'admin@teamly.com' && password === 'admin123') {
      try {
        const res = await api.post('/auth/login', { email: cleanEmail, password });
        localStorage.setItem('tp_token', res.data.access_token);
        localStorage.setItem('tp_user', JSON.stringify(res.data.user));
        onSuccess(res.data.user, res.data.access_token);
        setLoading(false);
        return;
      } catch {
        // Fallback local admin authentication if backend server is offline
        const adminUser = { id: 1, name: 'Admin Teamly', email: 'admin@teamly.com', role: 'admin' };
        const adminToken = 'admin_token_teamly_' + Date.now();
        localStorage.setItem('tp_token', adminToken);
        localStorage.setItem('tp_user', JSON.stringify(adminUser));
        onSuccess(adminUser, adminToken);
        setLoading(false);
        return;
      }
    }

    // 2. Standard Login / Register
    try {
      if (mode === 'login') {
        try {
          const res = await api.post('/auth/login', { email: cleanEmail, password });
          localStorage.setItem('tp_token', res.data.access_token);
          localStorage.setItem('tp_user', JSON.stringify(res.data.user));
          onSuccess(res.data.user, res.data.access_token);
          setLoading(false);
          return;
        } catch (apiErr) {
          // If backend returned a 401 error
          if (apiErr.response?.status === 401) {
            const localUsers = JSON.parse(localStorage.getItem('tp_registered_users') || '[]');
            const matched = localUsers.find(u => u.email === cleanEmail && u.password === password);
            if (matched) {
              const localUser = { id: matched.id, name: matched.name, email: matched.email };
              const localToken = 'local_token_' + matched.id;
              localStorage.setItem('tp_token', localToken);
              localStorage.setItem('tp_user', JSON.stringify(localUser));
              onSuccess(localUser, localToken);
              setLoading(false);
              return;
            }
            setErrorMsg('Email atau kata sandi salah');
            setLoading(false);
            return;
          }
          // If offline / network error, check local registered accounts
          const localUsers = JSON.parse(localStorage.getItem('tp_registered_users') || '[]');
          const matched = localUsers.find(u => u.email === cleanEmail && u.password === password);
          if (matched) {
            const localUser = { id: matched.id, name: matched.name, email: matched.email };
            const localToken = 'local_token_' + matched.id;
            localStorage.setItem('tp_token', localToken);
            localStorage.setItem('tp_user', JSON.stringify(localUser));
            onSuccess(localUser, localToken);
            setLoading(false);
            return;
          }
          setErrorMsg('Email atau password salah. Jika belum punya akun, silakan klik tab "Daftar Akun".');
          setLoading(false);
          return;
        }
      } else {
        // Mode REGISTER
        if (password.length < 8) {
          setErrorMsg('Password minimal 8 karakter');
          setLoading(false);
          return;
        }

        try {
          const res = await api.post('/auth/register', { name, email: cleanEmail, password });
          localStorage.setItem('tp_token', res.data.access_token);
          localStorage.setItem('tp_user', JSON.stringify(res.data.user));
          onSuccess(res.data.user, res.data.access_token);
          setLoading(false);
          return;
        } catch (apiErr) {
          if (apiErr.response?.data?.detail) {
            setErrorMsg(apiErr.response.data.detail);
            setLoading(false);
            return;
          }
          // Backend offline fallback - save user locally
          const localUsers = JSON.parse(localStorage.getItem('tp_registered_users') || '[]');
          if (localUsers.some(u => u.email === cleanEmail)) {
            setErrorMsg('Email sudah terdaftar. Silakan masuk.');
            setLoading(false);
            return;
          }
          const newUser = { id: Date.now(), name, email: cleanEmail };
          localUsers.push({ ...newUser, password });
          localStorage.setItem('tp_registered_users', JSON.stringify(localUsers));
          const localToken = 'local_reg_token_' + newUser.id;
          localStorage.setItem('tp_token', localToken);
          localStorage.setItem('tp_user', JSON.stringify(newUser));
          onSuccess(newUser, localToken);
          setLoading(false);
          return;
        }
      }
    } catch {
      setErrorMsg('Gagal memproses permintaan. Periksa kembali isian form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-clean-wrap">
      {/* Background Soft Glow */}
      <div className="welcome-glow-circle glow-top" />
      <div className="welcome-glow-circle glow-bottom" />

      {/* Main Single Centered Card */}
      <div className="auth-clean-box">
        {/* Top Back Nav */}
        <div className="auth-card-top-nav">
          <button
            type="button"
            className="btn-auth-back-link"
            onClick={onEnterDemo || onGoToLanding}
            title="Kembali ke Dashboard"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="auth-clean-brand">
          <div className="auth-clean-icon">
            <Rocket size={26} color="white" />
          </div>
          <div className="auth-clean-title-row">
            <h1 className="auth-clean-name">Teamly</h1>
            <span className="welcome-ai-badge">AI</span>
          </div>
          <p className="auth-clean-sub">
            {mode === 'login' ? 'Masuk untuk mengelola proyek & tugas kelompok' : 'Daftar akun baru untuk mulai berkolaborasi'}
          </p>
        </div>

        {/* Custom prompt if redirected from a restricted guest action */}
        {customPrompt && (
          <div className="auth-clean-prompt-banner">
            <span>🔒 {customPrompt}</span>
          </div>
        )}

        {/* Segmented Switcher: Masuk | Daftar Akun */}
        <div className="auth-clean-tabs">
          <button
            type="button"
            className={`auth-tab-pill ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(''); }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`auth-tab-pill ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrorMsg(''); }}
          >
            Daftar Akun
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error-box">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Minimal Clean Form */}
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
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="auth-field-group">
            <label className="auth-field-label">Email</label>
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
            <label className="auth-field-label">Kata Sandi</label>
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
                title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Lanjut sebagai Guest */}
        <div className="auth-clean-footer">
          <button
            type="button"
            className="btn-clean-guest"
            onClick={onEnterDemo || onGoToLanding}
          >
            <span>Lanjut sebagai Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
}
