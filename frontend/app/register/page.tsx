'use client';

import { Nunito, Fredoka } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info, User, Mail, Shield, AlertCircle, ArrowRight } from "lucide-react";
import Particles from "../components/Particles";
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });
const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '700'] });

export default function RegistrationPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schools = [
    { value: "beta-testers", label: "Beta Testers", disabled: false }, 
    { value: "cox-mill", label: "Cox Mill High School", disabled: true }, 
    { value: "ecot", label: "Early College of Technology", disabled: true }, 
    { value: "ec", label: "Early College", disabled: true }, 
    { value: "ecohs", label: "Early College Of Health Sciences", disabled: true }
  ];

  const [errors, setErrors] = useState({
    username: [] as string[],
    password: [] as string[],
    school: [] as string[],
    server: [] as string[],
  });

  const [showProfanityToast, setShowProfanityToast] = useState(false);

  useEffect(() => {
    if (showProfanityToast) {
      window.scrollTo(0, 0);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showProfanityToast]);

  const handleRegister = async () => {
    if (isSubmitting) return;

    if (matcher.hasMatch(username)) {
      setShowProfanityToast(true);
      return;
    }

    const newErrors = {
      username: [] as string[],
      password: [] as string[],
      school: [] as string[],
      server: [] as string[],
    };

    if (username.length < 6) newErrors.username.push("Must be at least 6 characters.");
    if (username.length > 20) newErrors.username.push("Must be 20 characters or less.");
    if (password.length < 8) newErrors.password.push("Must be at least 8 characters.");
    if (password.length > 20) newErrors.password.push("Must be 20 characters or less.");
    if (!/[A-Z]/.test(password)) newErrors.password.push("Must contain at least 1 uppercase letter.");
    if (!/[a-z]/.test(password)) newErrors.password.push("Must contain at least 1 lowercase letter.");
    if (!/[0-9]/.test(password)) newErrors.password.push("Must contain at least 1 number.");
    if (!/[^A-Za-z0-9]/.test(password)) newErrors.password.push("Must contain at least 1 special character (e.g. !@#$%).");
    if (!school) newErrors.school.push("Please select your school.");

    const hasErrors = Object.values(newErrors).some(arr => arr.length > 0);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
  }

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
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .register-page { animation: pageFadeIn 0.8s ease-out both; }
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
        @keyframes toastPop {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
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
        .profanity-toast { animation: toastPop 0.4s cubic-bezier(.4,2,.6,1) both; }
        ${showProfanityToast ? `
          ::-webkit-scrollbar-thumb { background: #555 !important; }
          ::-webkit-scrollbar-thumb:hover { background: #666 !important; }
          * { scrollbar-color: #555 transparent !important; }
          .fs-pill { filter: grayscale(100%) brightness(0.5) !important; pointer-events: none !important; }
        ` : ''}
      `}</style>

      <Particles />

      {/* PROFANITY TOAST OVERLAY */}
      {showProfanityToast && (
        <div
          onClick={() => setShowProfanityToast(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100dvh",
            zIndex: 2147483647,

            display: "grid",
            placeItems: "center",

            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div
            className="profanity-toast"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 40, 40, 0.12)',
              border: '1px solid rgba(255, 80, 80, 0.35)',
              boxShadow: '0 0 18px rgba(255, 60, 60, 0.25), 0 0 35px rgba(255, 0, 0, 0.15), 0 20px 60px rgba(0,0,0,0.6)',
              borderRadius: '20px',
              padding: '2rem 2.5rem',
              maxWidth: '420px',
              width: '90vw',
              textAlign: 'center',
              color: '#ff6b6b',
            }}
          >
            <div style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#ff9a9a',
              textShadow: '0 0 8px rgba(255, 80, 80, 0.8), 0 0 18px rgba(255, 0, 0, 0.45)',
              marginBottom: '0.6rem',
            }}>
              Error Code 420
            </div>

            <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem', lineHeight: 1 }}>🚫</div>

            <div style={{
              fontSize: '1.3rem',
              fontWeight: '800',
              color: '#ff9a9a',
              textShadow: '0 0 8px rgba(255, 80, 80, 0.8), 0 0 18px rgba(255, 0, 0, 0.45)',
              marginBottom: '0.5rem',
              letterSpacing: '0.5px',
            }}>
              No Profanity.
            </div>

            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255, 150, 150, 0.8)',
              lineHeight: '1.5',
              marginBottom: '1.5rem',
            }}>
              Your username contains inappropriate language. Please choose a different username.
            </div>

            <button
              onClick={() => setShowProfanityToast(false)}
              style={{
                background: 'rgba(255, 80, 80, 0.2)',
                border: '1px solid rgba(255, 80, 80, 0.4)',
                borderRadius: '12px',
                padding: '0.7rem 2rem',
                color: '#ff9a9a',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'background 0.2s',
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          className={`${fredoka.className} anim-title anim-glow`}
          style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            color: '#ff8c00', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold', 
            fontKerning: 'none', 
            letterSpacing: '0.2rem', 
            textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)', 
            marginTop: '-1rem' }}
        >
          Register
        </h1>

        <p className="anim-subtitle" style={{ 
            color: 'rgb(173, 101, 13)', 
            letterSpacing: '4.5px', 
            textTransform: 'uppercase', 
            fontSize: '1rem', 
            marginTop: '-0.5rem', 
            fontWeight: '700', 
            textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)' 
            }}>
          Already have an account? <strong style={{ cursor: 'pointer', color: "#ff8c00"}} onClick={() => router.push('/login')}> Sign In. </strong>
        </p>

        <div className="anim-line" style={{ display: 'inline-flex', width: 'calc(100% + 20px)', marginTop: '1.2rem', marginBottom: '-0.5rem', marginLeft: '-10px' }}>
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
                To enhance user privacy, we advise using a nickname rather than your real name. Although we implement security measures to protect user data, this additional step 
                helps minimize exposure of personal information in the rare event of a security incident.
              </div>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><User size={14} /> Username</label>
                <input
                  type="text"
                  className="register-input"
                  style={inputStyle}
                  placeholder="FinanceMaster42"
                  value={username}
                  maxLength={20}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <label style={labelStyle}><Mail size={14} /> Password</label>
            <input
              type="password"
              className="register-input"
              style={inputStyle}
              placeholder="Enter Your Password"
              value={password}
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
                    maxHeight: "110px",
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

            {Object.values(errors).some(arr => arr.length > 0) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                  background: "rgba(255, 40, 40, 0.12)",
                  border: "1px solid rgba(255, 80, 80, 0.35)",
                  boxShadow: '0 0 18px rgba(255, 60, 60, 0.25), 0 0 35px rgba(255, 0, 0, 0.15)',
                  padding: "1rem",
                  borderRadius: "12px",
                  color: "#ff6b6b",
                  fontSize: "0.9rem",
                  marginBottom: "1.25rem",
                }}
              >
                {errors.username.length > 0 && (
                  <div>
                    <strong style={{ color: "#ff9a9a", textShadow: '0 0 8px rgba(255, 80, 80, 0.8), 0 0 18px rgba(255, 0, 0, 0.45)', letterSpacing: "1px" }}>USERNAME</strong>
                    {errors.username.map((err, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {err}
                      </div>
                    ))}
                  </div>
                )}
                {errors.password.length > 0 && (
                  <div>
                    <strong style={{ color: "#ff9a9a", textShadow: '0 0 8px rgba(255, 80, 80, 0.8), 0 0 18px rgba(255, 0, 0, 0.45)', letterSpacing: "1px" }}>PASSWORD</strong>
                    {errors.password.map((err, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {err}
                      </div>
                    ))}
                  </div>
                )}
                {errors.school.length > 0 && (
                  <div>
                    <strong style={{ color: "#ff9a9a", textShadow: '0 0 8px rgba(255, 80, 80, 0.8), 0 0 18px rgba(255, 0, 0, 0.45)', letterSpacing: "1px" }}>SCHOOL</strong>
                    {errors.school.map((err, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /> {err}
                      </div>
                    ))}
                  </div>
                )}
                {errors.server.length > 0 && (
                  <div>
                    <strong style={{ color: "#ff9a9a", textShadow: '0 0 8px rgba(255, 80, 80, 0.8), 0 0 18px rgba(255, 0, 0, 0.45)', letterSpacing: "1px" }}>SERVER ERROR</strong>
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
              onClick={handleRegister}
              className="register-btn anim-btn"
              style={{
                ...primaryButtonStyle, 
                marginTop: '0',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? "ENTERING SIMULATION..." : "LET'S PLAY"} <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
