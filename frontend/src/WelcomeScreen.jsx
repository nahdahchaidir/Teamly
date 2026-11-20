import React from 'react';
import {
  Rocket,
  Sparkles,
  ArrowRight,
  Kanban,
  Users,
  Lightbulb,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function WelcomeScreen({ onOpenWorkspace, onStartSurvey, onOpenAuth }) {
  return (
    <div className="welcome-screen-wrap">
      {/* Background Soft Ambient Orange Glow */}
      <div className="welcome-glow-circle glow-top" />
      <div className="welcome-glow-circle glow-bottom" />

      {/* Main Centered Card */}
      <div className="welcome-card-box">
        {/* Prominent Teamly Logo */}
        <div className="welcome-logo-container">
          <div className="welcome-logo-glow" />
          <div className="welcome-logo-icon">
            <Rocket size={38} color="white" />
          </div>
        </div>

        {/* Application Name & Badge */}
        <div className="welcome-title-row">
          <h1 className="welcome-app-name">Teamly</h1>
          <span className="welcome-ai-badge">AI</span>
        </div>

        {/* Application Tagline & Description */}
        <p className="welcome-tagline">
          Platform Kolaborasi & Generator Ide Tugas Kuliah
        </p>

        <p className="welcome-description">
          Mulai tugas kelompokmu dari nol ide, temukan konsep inovatif dengan panduan AI,
          dan pantau pengerjaan sprint bersama teman sekelompok dalam satu papan yang rapi.
        </p>

        {/* 3 Quick Value Pills */}
        <div className="welcome-pills-row">
          <div className="welcome-pill">
            <Lightbulb size={14} className="pill-icon-orange" />
            <span>Survey Ide AI Instan</span>
          </div>
          <div className="welcome-pill">
            <Kanban size={14} className="pill-icon-orange" />
            <span>Papan Kanban Sprint</span>
          </div>
          <div className="welcome-pill">
            <Users size={14} className="pill-icon-orange" />
            <span>Beban Tugas Kelompok Adil</span>
          </div>
        </div>

        {/* Primary Action Buttons (Consistent Orange Look) */}
        <div className="welcome-actions-group">
          <button
            type="button"
            className="btn-welcome-primary"
            onClick={onOpenWorkspace}
          >
            <span>🚀 Buka Workspace Aplikasi</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="btn-welcome-secondary"
            onClick={onStartSurvey}
          >
            <Sparkles size={17} className="text-orange" />
            <span>✨ Langsung Mulai Survey Ide AI</span>
          </button>
        </div>

        {/* Auth Links */}
        <div className="welcome-auth-row">
          <span className="welcome-auth-hint">Punya akun tersimpan?</span>
          <button
            type="button"
            className="btn-welcome-link"
            onClick={() => onOpenAuth('login')}
          >
            <LogIn size={14} />
            <span>Masuk</span>
          </button>
          <span className="welcome-auth-sep">•</span>
          <button
            type="button"
            className="btn-welcome-link"
            onClick={() => onOpenAuth('register')}
          >
            <UserPlus size={14} />
            <span>Daftar Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Subtle Footer Note */}
      <footer className="welcome-screen-footer">
        <span>Teamly AI v1.0 • Didesain untuk kemudahan kolaborasi tugas kuliah mahasiswa</span>
      </footer>
    </div>
  );
}
