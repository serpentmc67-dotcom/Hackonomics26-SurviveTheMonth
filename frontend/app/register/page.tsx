'use client';

import { Nunito, Fredoka, Poppins } from "next/font/google";
import { useState } from "react";
import { User, Mail, Shield, AlertCircle, ArrowRight, Maximize2 } from "lucide-react";

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700', '900'] });
const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '700'] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"] });

export default function RegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  // --- Handlers ---
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic missing: Trigger 502 error
    setError("502 Bad Gateway. The Backend Isn't Connected/Doesn't Exist.");
  };

  const handleGoogleLogin = () => {
    // Logic missing: Trigger 502 error
    setError("502 Bad Gateway. The Backend Isn't Connected/Doesn't Exist.");
  };

  const handleAdminSubmit = () => {
    // Logic missing: Trigger 502 error
    setError("502 Bad Gateway. The Backend Isn't Connected/Doesn't Exist.");
  };

  // --- STYLE CONSTANTS ---
  
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
        <h1 className={fredoka.className} style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: '#ff8c00', marginBottom: '0.5rem', fontWeight: 'bold', fontKerning: 'none', letterSpacing: '0.2rem', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)' }}>
          Register
        </h1>
        
        <p style={{ color: 'rgb(173, 101, 13)', letterSpacing: '4.5px', textTransform: 'uppercase', fontSize: '1rem', marginTop: '-0.5rem', fontWeight: '700', textShadow: '5px 10px 30px rgba(255, 140, 0, 0.6)' }}>
          Already Have An Account? <strong> Sign In. </strong>
        </p>

        <div style={{ display: 'inlineflex', alignItems: 'center', width: 'calc(100% + 20px)', marginTop: '1.2rem', marginBottom: '0rem', marginLeft: '-10px'}}>
      <div style={{ flex: 1, height: '2px', background: 'rgba(251, 143, 10, 0.97)', borderRadius: '999px' }} />
        </div>
      </section>

      <section style={{textAlign: 'left', marginBottom: '1rem', marginTop: '-1rem'}}>
        <div style={{    
          background: 'rgba(255, 238, 0, 0.33)',
          borderRadius: '24px',
          border: '2px solid rgb(255, 251, 0)',
          padding: '2.5rem',
          width: '100%',
          boxShadow: 'inset 0 0 40px rgba(255, 230, 0, 0.35)',
          backdropFilter: 'blur(10px)' }}>
            <h2 style={{
              fontSize: '1.4rem',
              color: '#ff8c00',
              fontWeight: '600',
              marginBottom: '0.5rem',
              fontKerning: 'none',
              }}>
              IMPORTANT
            </h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Enter your details to begin your 30-day survival journey.
          </p>
        </div>
      </section>


      {/* FORM CARD */}
      <section style={sectionStyle}>
        <div style={cardStyle}>
          <h2 style={subheadingStyle}>Create Your Player</h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Enter your details to begin your 30-day survival journey.
          </p>

          <form onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><User size={14} /> First Name</label>
                <input 
                  style={inputStyle} 
                  placeholder="Jane" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><User size={14} /> Last Name</label>
                <input 
                  style={inputStyle} 
                  placeholder="Smith" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>

            <label style={labelStyle}><Mail size={14} /> Email Address</label>
            <input 
              style={inputStyle} 
              type="email" 
              placeholder="jane@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ fontSize: '0.75rem', color: '#444' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          </div>

          <button style={secondaryButtonStyle} onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: '8px' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </section>

      {/* ADMIN ACCESS */}
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

      {/* FOOTER ACTION */}
      <button 
        onClick={() => {}} 
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
      >
        <Maximize2 size={20} />
      </button>

    </main>
  );
}