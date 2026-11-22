import React, { useEffect } from 'react';
import { Rocket } from 'lucide-react';

export default function WelcomeScreen({ onOpenWorkspace }) {
  useEffect(() => {
    // Otomatis transisi ke dashboard setelah 1.5 detik
    const timer = setTimeout(() => {
      onOpenWorkspace();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onOpenWorkspace]);

  return (
    <div
      className="welcome-screen-wrap splash-mode"
      onClick={onOpenWorkspace}
      title="Klik untuk langsung masuk ke Dashboard"
    >
      {/* Background Soft Orange Glow */}
      <div className="welcome-glow-circle glow-top" />
      <div className="welcome-glow-circle glow-bottom" />

      {/* Clean Minimal Splash: Hanya Logo & Nama Aplikasi */}
      <div className="splash-center-box">
        <div className="welcome-logo-container">
          <div className="welcome-logo-glow" />
          <div className="welcome-logo-icon">
            <Rocket size={44} color="white" />
          </div>
        </div>

        <div className="welcome-title-row">
          <h1 className="welcome-app-name">Teamly</h1>
          <span className="welcome-ai-badge">AI</span>
        </div>

        {/* Minimal Animated Loading Indicator */}
        <div className="splash-loading-wrap">
          <div className="splash-progress-track">
            <div className="splash-progress-bar" />
          </div>
        </div>


      </div>
    </div>
  );
}
