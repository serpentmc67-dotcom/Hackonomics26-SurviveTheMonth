'use client';

import { Nunito, Fredoka, Poppins, Montserrat } from "next/font/google";
import { useState } from "react";
import { User, Mail, Shield, AlertCircle, ArrowRight, Maximize2 } from "lucide-react";

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
    // Logic missing: Trigger 502 error
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
    transition: 'transform 0.2s ease'
  };

  const secondaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.9rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
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
      className={nunito.className}
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 40%, #0a0a22 0%, #000 100%)',
        color: 'white',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* HEADER */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className={fredoka.className} style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: '#ff8c00', marginBottom: '0.5rem', fontWeight: 'bold', fontKerning: 'none', letterSpacing: '0.2rem', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)', marginTop: '-1rem' }}>
          Register
        </h1>
        
        <p style={{ color: 'rgb(173, 101, 13)', letterSpacing: '4.5px', textTransform: 'uppercase', fontSize: '1rem', marginTop: '-0.5rem', fontWeight: '700', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)' }}>
          Already Have An Account? <strong> Sign In. </strong>
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', width: 'calc(100% + 20px)', marginTop: '1.2rem', marginBottom: '-0.5rem', marginLeft: '-10px'}}>
      <div style={{ flex: 1, height: '2px', background: 'rgba(251, 143, 10, 0.97)', borderRadius: '999px' }} />
        </div>
      </section>

{/*
      <section style={{textAlign: 'left', marginBottom: '1rem', marginTop: '-1rem'}}>
        <div style={{    
          background: 'rgba(255, 238, 0, 0.33)',
          borderRadius: '24px',
          border: '2px solid rgb(255, 251, 0)',
          padding: '2.5rem',
          width: '100%',
          boxShadow: 'inset 0 0 40px rgba(255, 230, 0, 0.35)',
          backdropFilter: 'blur(10px)' }}>
           <h2 className={montserrat.className}
            style={{
              fontSize: '1.2rem',
              color: '#f5f50c',
              fontWeight: '600',
              marginBottom: '0.5rem',
              }}>
              IMPORTANT
            </h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Enter your details to begin your 30-day survival journey.
          </p>
        </div>
      </section>

*/}

      {/* FORM CARD */}
      <section style={sectionStyle}>
        <div style={cardStyle}>
          <h2 style={subheadingStyle}>Create Your Account</h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Create your account to begin a 30-day financial simulation where every decision matters.
          </p>

          <form onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><User size={14} /> Username</label>
                <input 
                  style={inputStyle} 
                  placeholder="FinanceMaster42" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
            </div>

            <label style={labelStyle}><Mail size={14} /> Password</label>
            <input 
              style={inputStyle} 
              type="password" 
              placeholder="Enter Your Password" 
              value={password} 
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

            {/* Dropdown */}
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

            <button type="submit" style={primaryButtonStyle}>
              LET'S PLAY <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* ADMIN ACCESS
      <section style={{ width: '100%', maxWidth: '550px', marginTop: '1rem' }}>
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
          <button style={{ ...secondaryButtonStyle, width: 'auto', padding: '0.9rem 1.5rem' }} onClick={handleAdminSubmit}>
            ENTER
          </button>
        </div>
      </section>
      */}

      {/* FOOTER ACTION
      <button 
        onClick={() => {}} 
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
      >
        <Maximize2 size={20} />
      </button>
      */}

    </main>
  );
}