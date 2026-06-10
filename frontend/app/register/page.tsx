'use client';

import { Nunito, Fredoka, Poppins, Montserrat } from "next/font/google";
import { useState } from "react";
import { Info } from "lucide-react";
import { User, Mail, Shield, AlertCircle, ArrowRight, Maximize2 } from "lucide-react";
import Particles from "../components/Particles";

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });
const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"] });

export default function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [schoolOpen, setSchoolOpen] = useState(false);
  const schools = [{ value: "beta-testers", label: "Beta Testers", disabled: false }, { value: "cox-mill", label: "Cox Mill High School", disabled: true }, { value: "ecot", label: "Early College of Technology", disabled: true }, { value: "ec", label: "Early College", disabled: true }, { value: "ecohs", label: "Early College Of Health Sciences", disabled: true }];
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

      if (username.length < 6) {
    setError("Username must be at least 3 characters.");
    return;
  }
  if (username.length > 20) {
    setError("Username must be 20 characters or less.");
    return;
  }
  if (password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
  }
  if (password.length > 20) {
    setError("Password must be 64 characters or less.");
    return;
  }

    setError("502 Bad Gateway. The Backend Isn't Connected/Doesn't Exist.");
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
    className={`${nunito.className} register-page`}
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
        from {
      opacity: 0;
      transform: translateY(18px);
        }
        to {
      opacity: 1;
      transform: translateY(0);
        }
      }
      .register-page {
        animation: pageFadeIn 0.8s ease-out both;
      }
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
      @keyframes warnFade {
        from { opacity: 0; transform: translateY(10px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
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
      .anim-warn     { animation: warnFade 0.7s 0.85s ease both; }
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
    `}</style>

    <Particles />

      {/* HEADER */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          className={`${fredoka.className} anim-title anim-glow`}
          style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: '#ff8c00', marginBottom: '0.5rem', fontWeight: 'bold', fontKerning: 'none', letterSpacing: '0.2rem', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)', marginTop: '-1rem' }}
        >
          Register
        </h1>
        
        <p className="anim-subtitle" style={{ color: 'rgb(173, 101, 13)', letterSpacing: '4.5px', textTransform: 'uppercase', fontSize: '1rem', marginTop: '-0.5rem', fontWeight: '700', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)' }}>
          Already Have An Account? <strong> Sign In. </strong>
        </p>

        <div className="anim-line" style={{ display: 'inline-flex', alignItems: 'center', width: 'calc(100% + 20px)', marginTop: '1.2rem', marginBottom: '-0.5rem', marginLeft: '-10px' }}>
          <div style={{ flex: 1, height: '2px', background: 'rgba(251, 143, 10, 0.97)', borderRadius: '999px' }} />
        </div>
      </section>

      {/* FORM CARD */}
      <section className="anim-card" style={{...sectionStyle, marginTop: "-2rem", boxShadow: '0 10px 30px rgba(0,0,0,0.55)'}}>
        <div style={cardStyle} className="shimmer-card">
          <h2 style={subheadingStyle}>Create Your Account</h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Create your account to begin a 30-day financial simulation where every decision matters.
          </p>

          <div
            className="anim-warn"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.2rem",
              marginBottom: "1.3rem",
              marginTop: "-1rem",
              marginLeft: "-1.2rem",
              marginRight: "-1.2rem",
              borderRadius: "14px",
              maxWidth: '750px',
              border: "1px solid rgba(255, 200, 0, 0.45)",
              background: "rgba(120, 90, 0, 0.25)",
              boxShadow: "0 0 15px rgba(255, 200, 0, 0.15)",
            }}
          >
            <Info
              size={16}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "rgba(255, 208, 0, 0.55)",
                filter: "drop-shadow(0 0 6px rgba(255,255,255,0.15))",
                cursor: "default",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "800", letterSpacing: "2px", color: "rgba(255, 220, 120, 0.9)", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                USER ADVISORY NOTICE
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255, 200, 90, 0.85)", lineHeight: "1.4" }}>
                To enhance user privacy, we advise using a nickname rather than your real name. Although we implement security measures to protect user data, this additional step helps minimize exposure of personal information in the rare event of a security incident.
              </div>
            </div>
          </div>

          <form onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><User size={14} /> Username</label>
                <input
                  className="register-input"
                  style={inputStyle}
                  placeholder="FinanceMaster42"
                  value={username}
                  minLength={6}
                  maxLength={20}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <label style={labelStyle}><Mail size={14} /> Password</label>
            <input
              className="register-input"
              style={inputStyle}
              type="password"
              placeholder="Enter Your Password"
              value={password}
              minLength={8}
              maxLength={20}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label style={labelStyle}><Shield size={14} /> School</label>
            <div style={{ position: "relative", width: "100%" }}>
              <div
                onClick={() => setSchoolOpen(!schoolOpen)}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: school ? "white" : "rgba(255,255,255,0.5)",
                }}
              >
                {schools.find(s => s.value === school)?.label || "Select Your School"}
                <span style={{ color: "#ff8c00" }}>▼</span>
              </div>

              {schoolOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    width: "100%",
                    background: "#111",
                    border: "1px solid rgba(255,140,0,0.3)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    overflowY: "auto",
                    maxHeight: "160px",
                    zIndex: 1000,
                  }}
                >
                  {schools.map((s) => (
                    <div
                      key={s.value}
                      onClick={() => {
                        if (s.disabled) return;
                        setSchool(s.value);
                        setSchoolOpen(false);
                      }}
                      style={{
                        padding: "0.9rem",
                        color: s.disabled ? "#666" : "white",
                        cursor: s.disabled ? "not-allowed" : "pointer",
                        opacity: s.disabled ? 0.5 : 1,
                      }}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.3)',
                padding: '1rem', borderRadius: '12px', color: '#ff5252', fontSize: '0.9rem', marginBottom: '1.25rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="register-btn anim-btn"
              style={{...primaryButtonStyle, marginTop: '2rem'}}
            >
              LET'S PLAY <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* ADMIN ACCESS 
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
            onClick={() => {}}
          >
            ENTER
          </button>
        </div>
      </section> */}
    </main>
  );
}