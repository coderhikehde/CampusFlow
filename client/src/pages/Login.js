import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = [
  { id: 'student', label: 'Student', icon: '🎓', desc: 'Register & attend events' },
  { id: 'committee', label: 'Committee', icon: '⚡', desc: 'Manage & organize events' },
  { id: 'admin', label: 'Admin', icon: '👑', desc: 'Full platform control' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [titleIndex, setTitleIndex] = useState(0);

  const titles = ['Effortlessly.', 'Beautifully.', 'Intelligently.', 'Powerfully.'];

  // Typewriter cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex(i => (i + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Mount animation
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Particle constellation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(129,140,248,0.6)';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .cf-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #04050a;
          overflow: hidden;
          position: relative;
        }

        /* ANIMATED GRADIENT MESH */
        .cf-mesh {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .cf-mesh-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: cfMeshMove linear infinite;
          opacity: 0.12;
        }

        .cf-mesh-blob:nth-child(1) {
          width: 700px; height: 700px;
          background: radial-gradient(circle, #6366f1, #4f46e5);
          top: -200px; left: -200px;
          animation-duration: 20s;
        }

        .cf-mesh-blob:nth-child(2) {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #06b6d4, #0891b2);
          bottom: -150px; right: -100px;
          animation-duration: 25s;
          animation-direction: reverse;
          opacity: 0.08;
        }

        .cf-mesh-blob:nth-child(3) {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #8b5cf6, #7c3aed);
          top: 40%; left: 30%;
          animation-duration: 18s;
          animation-delay: -8s;
          opacity: 0.07;
        }

        .cf-mesh-blob:nth-child(4) {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #ec4899, #db2777);
          top: 10%; right: 20%;
          animation-duration: 22s;
          animation-delay: -5s;
          opacity: 0.05;
        }

        @keyframes cfMeshMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, -60px) scale(1.05); }
          50% { transform: translate(-30px, 40px) scale(0.95); }
          75% { transform: translate(50px, 30px) scale(1.02); }
        }

        /* GRID */
        .cf-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* CANVAS */
        .cf-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        /* LEFT */
        .cf-left {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          z-index: 1;
        }

        .cf-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cf-brand-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }

        .cf-brand-name {
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .cf-hero { max-width: 480px; }

        .cf-hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 600;
          color: #a5b4fc;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .cf-dot {
          width: 7px; height: 7px;
          background: #6366f1;
          border-radius: 50%;
          box-shadow: 0 0 8px #6366f1;
          animation: cfDot 2s ease-in-out infinite;
        }

        @keyframes cfDot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.6); }
        }

        .cf-hero-title {
          font-size: clamp(40px, 4.5vw, 64px);
          font-weight: 800;
          color: white;
          line-height: 1.05;
          letter-spacing: -2.5px;
          margin-bottom: 20px;
        }

        .cf-title-grad {
          background: linear-gradient(135deg, #818cf8, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          transition: opacity 0.5s ease;
          animation: cfFadeWord 0.5s ease;
        }

        @keyframes cfFadeWord {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cf-hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.38);
          line-height: 1.75;
          font-weight: 400;
          margin-bottom: 52px;
        }

        .cf-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 0;
        }

        .cf-stat-num {
          font-size: 32px;
          font-weight: 800;
          color: white;
          letter-spacing: -1.5px;
          display: block;
        }

        .cf-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 500;
        }

        .cf-features {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cf-feat {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
        }

        /* DIVIDER */
        .cf-div {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent);
          z-index: 1;
        }

        /* RIGHT */
        .cf-right {
          width: 500px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 44px;
          position: relative;
          z-index: 1;
          background: rgba(7,9,15,0.8);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255,255,255,0.05);
        }

        .cf-form-wrap {
          width: 100%;
          max-width: 380px;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(28px)'};
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cf-form-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          letter-spacing: -1.2px;
          margin-bottom: 6px;
        }

        .cf-form-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 32px;
          font-weight: 400;
        }

        /* ROLE SELECTOR */
        .cf-roles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 28px;
        }

        .cf-role {
          background: rgba(255,255,255,0.03);
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px 10px;
          cursor: pointer;
          text-align: center;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .cf-role:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.05);
          transform: translateY(-2px);
        }

        .cf-role.active {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.1);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1), 0 4px 16px rgba(99,102,241,0.2);
          transform: translateY(-2px);
        }

        .cf-role.active::before {
          content: '✓';
          position: absolute;
          top: 8px; right: 10px;
          font-size: 10px;
          color: #818cf8;
          font-weight: 700;
        }

        .cf-role-icon {
          font-size: 22px;
          margin-bottom: 6px;
          display: block;
        }

        .cf-role-label {
          font-size: 12px;
          font-weight: 700;
          color: white;
          display: block;
          margin-bottom: 3px;
          letter-spacing: -0.2px;
        }

        .cf-role-desc {
          font-size: 10px;
          color: rgba(255,255,255,0.25);
          line-height: 1.4;
          display: block;
        }

        .cf-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13px;
          color: #fca5a5;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cf-field { margin-bottom: 18px; }

        .cf-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .cf-input-wrap { position: relative; }

        .cf-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          opacity: 0.35;
          pointer-events: none;
        }

        .cf-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 15px 16px 15px 46px;
          font-size: 14px;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }

        .cf-input::placeholder { color: rgba(255,255,255,0.12); }

        .cf-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
        }

        .cf-forgot {
          text-align: right;
          margin-top: -10px;
          margin-bottom: 24px;
        }

        .cf-forgot a {
          font-size: 12px;
          color: rgba(99,102,241,0.6);
          text-decoration: none;
          transition: color 0.2s;
        }

        .cf-forgot a:hover { color: #818cf8; }

        .cf-btn {
          width: 100%;
          height: 54px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          letter-spacing: -0.2px;
        }

        .cf-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: left 0.5s ease;
        }

        .cf-btn:hover:not(:disabled)::after { left: 150%; }

        .cf-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 32px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .cf-btn:active:not(:disabled) { transform: scale(0.99); }
        .cf-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cf-sep {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .cf-sep-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        .cf-sep span {
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .cf-register {
          text-align: center;
          font-size: 14px;
          color: rgba(255,255,255,0.28);
        }

        .cf-register a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 600;
          margin-left: 4px;
          transition: color 0.2s;
        }

        .cf-register a:hover { color: #a5b4fc; }

        .cf-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: white;
          border-radius: 50%;
          animation: cfSpin 0.7s linear infinite;
        }

        @keyframes cfSpin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .cf-left, .cf-div { display: none; }
          .cf-right { width: 100%; background: #07090f; }
        }
      `}</style>

      <div className="cf-root">
        {/* Animated gradient mesh */}
        <div className="cf-mesh">
          <div className="cf-mesh-blob" />
          <div className="cf-mesh-blob" />
          <div className="cf-mesh-blob" />
          <div className="cf-mesh-blob" />
        </div>
        <div className="cf-grid" />

        {/* LEFT PANEL */}
        <div className="cf-left">
          <canvas ref={canvasRef} className="cf-canvas" />

          <div className="cf-brand">
            <div className="cf-brand-icon">🎓</div>
            <span className="cf-brand-name">CampusFlow</span>
          </div>

          <div className="cf-hero">
            <div className="cf-hero-tag">
              <div className="cf-dot" />
              Smart Campus Platform
            </div>
            <h1 className="cf-hero-title">
              Manage Events<br />
              <span className="cf-title-grad" key={titleIndex}>
                {titles[titleIndex]}
              </span>
            </h1>
            <p className="cf-hero-sub">
              The all-in-one platform for campus event management,<br />
              crowd monitoring, QR ticketing & real-time analytics.
            </p>
            <div className="cf-stats">
              {[['2.4k+', 'Students'], ['180+', 'Events'], ['99.9%', 'Uptime']].map(([n, l]) => (
                <div key={l}>
                  <span className="cf-stat-num">{n}</span>
                  <span className="cf-stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cf-features">
            {['🔐 Secure Auth', '📊 Live Analytics', '🎫 QR Tickets', '🚨 Emergency SOS', '💰 Budget Tracker'].map(f => (
              <div key={f} className="cf-feat">{f}</div>
            ))}
          </div>
        </div>

        <div className="cf-div" />

        {/* RIGHT PANEL */}
        <div className="cf-right">
          <div className="cf-form-wrap">
            <h2 className="cf-form-title">Welcome back 👋</h2>
            <p className="cf-form-sub">Sign in to your CampusFlow account</p>

            {/* ROLE SELECTOR */}
            <div className="cf-roles">
              {ROLES.map(role => (
                <div
                  key={role.id}
                  className={`cf-role ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <span className="cf-role-icon">{role.icon}</span>
                  <span className="cf-role-label">{role.label}</span>
                  <span className="cf-role-desc">{role.desc}</span>
                </div>
              ))}
            </div>

            {error && <div className="cf-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="cf-field">
                <label className="cf-label">Email Address</label>
                <div className="cf-input-wrap">
                  <span className="cf-input-icon">✉️</span>
                  <input
                    className="cf-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    required
                  />
                </div>
              </div>

              <div className="cf-field">
                <label className="cf-label">Password</label>
                <div className="cf-input-wrap">
                  <span className="cf-input-icon">🔑</span>
                  <input
                    className="cf-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                  />
                </div>
              </div>

              <div className="cf-forgot">
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="cf-btn" disabled={loading}>
                {loading
                  ? <><div className="cf-spinner" /> Signing in...</>
                  : `Sign in as ${ROLES.find(r => r.id === selectedRole)?.label} →`
                }
              </button>
            </form>

            <div className="cf-sep">
              <div className="cf-sep-line" />
              <span>New here?</span>
              <div className="cf-sep-line" />
            </div>

            <div className="cf-register">
              Don't have an account?
              <Link to="/register">Create one free</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;