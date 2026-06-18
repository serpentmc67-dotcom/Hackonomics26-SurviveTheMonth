'use client';

import { Nunito, Fredoka } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, AlertCircle, ArrowRight } from "lucide-react";
import Particles from "../components/Particles";

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });
const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '700'] });

interface SystemLog {
  _id: string;
  timestamp: string;
  event: string;
  meta?: Record<string, unknown>;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const [errors, setErrors] = useState({
    username: [] as string[],
    password: [] as string[],
    server: [] as string[],
  });

  const handleLogin = async () => {
    if (isSubmitting) return;

    const newErrors = {
      username: [] as string[],
      password: [] as string[],
      server: [] as string[],
    };

    if (!username) newErrors.username.push("Please enter your username.");
    if (!password) newErrors.password.push("Please enter your password.");

    const hasErrors = Object.values(newErrors).some(arr => arr.length > 0);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          username: [], password: [],
          server: [data.message || "Login failed."],
        });
        setIsSubmitting(false);
      } else {
        setErrors({ username: [], password: [], server: [] });
        localStorage.setItem("username", username);
        router.push("/");
      }
    } catch {
      setErrors({
        username: [], password: [],
        server: ["Could not connect to the backend. Please check if your server is running on port 5000."],
      });
      setIsSubmitting(false);
    }
  };

  const handleFetchLogs = async () => {
    if (!adminCode) {
      alert("Please enter an access code.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretCode: adminCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Access Denied.");
      } else {
        setLogs(data.logs);
        setShowLogsModal(true);
      }
    } catch {
      alert("Error reaching the backend administration route.");
    }
  };

  const sectionStyle = {
    marginBottom: '2.5rem',
    width: '100%',
    maxWidth: '550px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 140, 66, 0.15)',
    padding: '2.5rem',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#ff8c00',
    marginBottom: '0.6rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1.5px solid rgba(255, 140, 66, 0.2)',
    borderRadius: '14px',
    padding: '0.9rem 1.1rem',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1.25rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '1.1rem',
    background: 'linear-gradient(135deg, #ff8c00, #e67300)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(255, 120, 0, 0.3)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const subheadingStyle = {
    fontSize: '1.4rem',
    color: '#ff8c00',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    fontFamily: fredoka.style.fontFamily
  };

  return (
    <main
      className={`${nunito.className} login-page`}
      style={{
        minHeight: '100vh',
        color: 'white',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-page { animation: pageFadeIn 0.8s ease-out both; }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(220%); }
          100% { transform: translateX(220%); }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 5px 10px 30px rgba(255,140,0,0.4); }
          50%       { text-shadow: 5px 10px 55px rgba(255,140,0,1); }
        }
        @keyframes lineDraw {
          from { opacity: 0; transform: scaleX(0); transform-origin: left; }
          to   { opacity: 1; transform: scaleX(1); transform-origin: left; }
        }
        @keyframes registerPop {
          0%   { opacity: 0; transform: scale(0.6) translateY(30px); }
          70%  { transform: scale(1.08) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim-title    { animation: registerPop 0.9s 0.1s cubic-bezier(.4,2,.6,1) both; }
        .anim-glow     { animation: glowPulse 2.5s 1s ease infinite; }
        .anim-subtitle { animation: fadeDown 0.8s 0.35s ease both; }
        .anim-line     { animation: lineDraw 0.7s 0.5s ease both; }
        .anim-card     { animation: cardUp  0.8s 0.65s ease both; }
        .anim-btn      { animation: fadeDown 0.7s 1.05s ease both; }
        .shimmer-card  { position: relative; overflow: hidden; }
        .shimmer-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.055) 50%, transparent 70%);
          transform: translateX(-100%);
          animation: shimmer 3.5s ease infinite;
          pointer-events: none;
          border-radius: 24px;
          z-index: 0;
        }
        .shimmer-card > * { position: relative; z-index: 1; }
        .login-btn:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 12px 35px rgba(255,120,0,0.55) !important;
        }
      `}</style>

      <Particles />

      {/* HEADER */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          className={`${fredoka.className} anim-title anim-glow`}
          style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: '#ff8c00', marginBottom: '0.5rem', fontWeight: 'bold', letterSpacing: '0.2rem', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)', marginTop: '-1rem' }}
        >
          Sign In
        </h1>

        <p className="anim-subtitle" style={{ color: 'rgb(173, 101, 13)', letterSpacing: '4.5px', textTransform: 'uppercase', fontSize: '1rem', marginTop: '-0.5rem', fontWeight: '700', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)' }}>
          Don't have an account? <strong style={{ cursor: 'pointer' }} onClick={() => router.push('/register')}> Register. </strong>
        </p>

        <div className="anim-line" style={{ display: 'inline-flex', width: 'calc(100% + 20px)', marginTop: '1.2rem', marginBottom: '-0.5rem', marginLeft: '-10px' }}>
          <div style={{ flex: 1, height: '2px', background: 'rgba(251, 143, 10, 0.97)', borderRadius: '999px' }} />
        </div>
      </section>

      {/* FORM CARD */}
      <section className="anim-card" style={{...sectionStyle, marginTop: "-2rem", boxShadow: '0 10px 30px rgba(0,0,0,0.55)'}}>
        <div style={cardStyle} className="shimmer-card">
          <h2 style={subheadingStyle}>Welcome Back</h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Sign in to continue your 30-day financial simulation.
          </p>

          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <label style={labelStyle}><User size={14} /> Username</label>
            <input
              type="text"
              className="login-input"
              style={inputStyle}
              placeholder="FinanceMaster42"
              value={username}
              maxLength={20}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label style={labelStyle}><Mail size={14} /> Password</label>
            <input
              type="password"
              className="login-input"
              style={inputStyle}
              placeholder="Enter Your Password"
              value={password}
              maxLength={20}
              onChange={(e) => setPassword(e.target.value)}
            />

            {Object.values(errors).some(arr => arr.length > 0) && (
              <div style={{
                display: "flex", flexDirection: "column", gap: "0.8rem",
                background: "rgba(255, 40, 40, 0.12)", border: "1px solid rgba(255, 80, 80, 0.35)",
                boxShadow: '0 0 18px rgba(255, 60, 60, 0.25), 0 0 35px rgba(255, 0, 0, 0.15)',
                padding: "1rem", borderRadius: "12px", color: "#ff6b6b",
                fontSize: "0.9rem", marginBottom: "1.25rem",
              }}>
                {errors.username.length > 0 && (
                  <div>
                    <strong style={{ color: "#ff9a9a", textShadow: '0 0 8px rgba(255,80,80,0.8)', letterSpacing: "1px" }}>USERNAME</strong>
                    {errors.username.map((err, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {err}
                      </div>
                    ))}
                  </div>
                )}
                {errors.password.length > 0 && (
                  <div>
                    <strong style={{ color: "#ff9a9a", textShadow: '0 0 8px rgba(255,80,80,0.8)', letterSpacing: "1px" }}>PASSWORD</strong>
                    {errors.password.map((err, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {err}
                      </div>
                    ))}
                  </div>
                )}
                {errors.server.length > 0 && (
                  <div>
                    <strong style={{ color: "#ff9a9a", textShadow: '0 0 8px rgba(255,80,80,0.8)', letterSpacing: "1px" }}>SERVER ERROR</strong>
                    {errors.server.map((err, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {err}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleLogin}
              className="login-btn anim-btn"
              style={{
                ...primaryButtonStyle,
                marginTop: '0',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? "SIGNING IN..." : "LET'S PLAY"} <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* ADMIN ACCESS */}
      <section className="anim-btn" style={{ width: '100%', maxWidth: '550px', marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              style={{ ...inputStyle, marginBottom: 0, paddingLeft: '2.5rem' }}
              type="password"
              placeholder="Admin Access Code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
            <Shield size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,140,66,0.4)' }} />
          </div>
          <button
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: 'auto', padding: '0.9rem 1.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', color: 'white', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.3s ease' }}
            onClick={handleFetchLogs}
          >
            ENTER
          </button>
        </div>
      </section>

      {/* SYSTEM LOGS MODAL */}
      {showLogsModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }}>
          <div style={{
            background: '#111', border: '1px solid #ff8c00', borderRadius: '16px',
            padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#ff8c00', margin: 0, fontFamily: fredoka.style.fontFamily, fontSize: '1.25rem' }}>Security & System Logs</h3>
              <button
                onClick={() => setShowLogsModal(false)}
                style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {logs.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>No logged infrastructure events found.</p>
              ) : (
                logs.map((log) => (
                  <div key={log._id} style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.8rem', borderRadius: '8px', borderLeft: '3px solid #ff8c00', lineHeight: '1.4' }}>
                    <span style={{ color: '#666', marginRight: '0.5rem' }}>
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <strong style={{ color: '#eee' }}>{log.event}</strong>
                    {log.meta && (
                      <div style={{ color: '#a8600c', fontSize: '0.75rem', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                        Metadata: {JSON.stringify(log.meta)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}