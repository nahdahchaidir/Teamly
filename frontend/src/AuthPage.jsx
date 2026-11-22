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
import api, { getApiErrorMessage } from './api';

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
  const [infoMsg, setInfoMsg] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingCredentials, setPendingCredentials] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    try {
      if (verificationPending) {
        const res = await api.post('/auth/verify-email', {
          email: pendingCredentials.email,
          code: verificationCode.trim()
        });
        localStorage.setItem('tp_token', res.data.access_token);
        localStorage.setItem('tp_user', JSON.stringify(res.data.user));
        onSuccess(res.data.user, res.data.access_token);
        return;
      }

      if (mode === 'login') {
        const res = await api.post('/auth/login', { email: cleanEmail, password });
        localStorage.setItem('tp_token', res.data.access_token);
        localStorage.setItem('tp_user', JSON.stringify(res.data.user));
        onSuccess(res.data.user, res.data.access_token);
      } else {
        if (password.length < 8) {
          setErrorMsg('Password minimal 8 karakter');
          return;
        }
        await api.post('/auth/register', { name, email: cleanEmail, password });
        setPendingCredentials({ email: cleanEmail, password });
        setVerificationPending(true);
        setInfoMsg('Kode verifikasi telah dikirim ke email Anda.');
      }
    } catch (apiErr) {
      if (apiErr.response?.status === 403 && mode === 'login') {
        setPendingCredentials({ email: cleanEmail, password });
        setVerificationPending(true);
        setErrorMsg('Email belum diverifikasi. Masukkan kode yang dikirim ke email Anda.');
      } else {
        setErrorMsg(getApiErrorMessage(apiErr, 'Gagal memproses permintaan. Periksa koneksi dan isian form.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!pendingCredentials) return;
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verification/resend', pendingCredentials);
      setInfoMsg(res.data.message);
    } catch (apiErr) {
      setErrorMsg(getApiErrorMessage(apiErr, 'Gagal mengirim ulang kode verifikasi.'));
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
            {verificationPending
              ? 'Verifikasi alamat email untuk mengaktifkan akun'
              : mode === 'login'
                ? 'Masuk untuk mengelola project & tugas kelompok'
                : 'Daftar akun baru untuk mulai berkolaborasi'}
          </p>
        </div>

        {/* Custom prompt if redirected from a restricted guest action */}
        {customPrompt && (
          <div className="auth-clean-prompt-banner">
            <span>🔒 {customPrompt}</span>
          </div>
        )}

        {/* Segmented Switcher: Masuk | Daftar Akun */}
        {!verificationPending && <div className="auth-clean-tabs">
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
        </div>}

        {errorMsg && (
          <div className="auth-error-box">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}
        {infoMsg && <div className="auth-verification-note">{infoMsg}</div>}

        {/* Minimal Clean Form */}
        <form onSubmit={handleSubmit} className="auth-actual-form">
          {!verificationPending && mode === 'register' && (
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
                value={verificationPending ? pendingCredentials?.email || email : email}
                readOnly={verificationPending}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {!verificationPending && (
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
          )}

            {verificationPending && (
              <div className="auth-field-group">
                <label className="auth-field-label">Kode Verifikasi Email</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-field-icon" />
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="auth-text-input"
                    placeholder="6 digit kode"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                <span>{verificationPending ? 'Verifikasi dan Masuk' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
          {verificationPending && (
            <div className="auth-verification-actions">
              <button type="button" className="btn-clean-guest" onClick={resendVerification} disabled={loading}>
                Kirim ulang kode
              </button>
              <button
                type="button"
                className="btn-clean-guest"
                onClick={() => { setVerificationPending(false); setVerificationCode(''); setErrorMsg(''); }}
              >
                Kembali ke masuk
              </button>
            </div>
          )}
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
