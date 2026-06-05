"use client";

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';

/**
 * Survive the Month - Registration Page
 * Converted from HTML/CSS/JS to Next.js TypeScript
 */

// --- Types ---
interface RegisterResponse {
  ok: boolean;
  id?: string;
  total?: number;
  error?: string;
}

const GOOGLE_CLIENT_ID = '1003822131398-h0v9427prbnm3jljbbsre5t3dn9jakbp.apps.googleusercontent.com';
const ADMIN_PASSWORD = "Hharis3569611795";

export default function RegistrationPage() {
  // --- State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [adminCode, setAdminCode] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'err' | 'ok' | 'warn' | '' }>({ text: '', type: '' });
  const [adminMsg, setAdminMsg] = useState<{ text: string; type: 'err' | 'ok' | 'warn' | '' }>({ text: '', type: '' });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ name: string; total: number | null }>({ name: '', total: null });
  const [countdown, setCountdown] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: boolean; lastName?: boolean; email?: boolean }>({});

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // --- Effects ---
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
    };
  }, []);

  useEffect(() => {
    if (showSuccess && countdown > 0) {
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
            goToGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [showSuccess]);

  // --- Handlers ---
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
      else if ((el as any).mozRequestFullScreen) (el as any).mozRequestFullScreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
      else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen();
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) newErrors.email = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setMsg({ 
        text: !firstName.trim() || !lastName.trim() ? 'Please enter your first and last name.' : 'Please enter a valid email address.', 
        type: 'err' 
      });
      return false;
    }
    return true;
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email })
      });
      const data: RegisterResponse = await res.json();
      
      if (data.ok) {
        completeRegistration(firstName, lastName, email, data.id, data.total || null);
      } else {
        setMsg({ text: data.error || 'Something went wrong.', type: 'err' });
        setIsSubmitting(false);
      }
    } catch (err) {
      // Fallback for demo/offline
      completeRegistration(firstName, lastName, email, 'offline-id', null);
    }
  };

  const completeRegistration = (fn: string, ln: string, em: string, id: string | undefined, total: number | null) => {
    sessionStorage.setItem('player_name', `${fn} ${ln}`);
    sessionStorage.setItem('player_email', em);
    if (id) sessionStorage.setItem('player_id', id);
    
    setSuccessData({ name: `${fn} ${ln}`, total });
    setShowSuccess(true);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    if (typeof (window as any).google === 'undefined') {
      setMsg({ text: 'Google sign-in failed to load. Please fill in the form manually.', type: 'err' });
      setIsGoogleLoading(false);
      return;
    }

    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          setMsg({ text: 'Google sign-in was cancelled or failed.', type: 'err' });
          setIsGoogleLoading(false);
          return;
        }
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          });
          const info = await res.json();
          const fn = info.given_name || info.name?.split(' ')[0] || '';
          const ln = info.family_name || info.name?.split(' ').slice(1).join(' ') || '';
          const em = info.email || '';
          
          setFirstName(fn);
          setLastName(ln);
          setEmail(em);
          
          if (fn && ln && em) {
            // Auto-submit if all info is present
            await handleRegister(); 
          } else {
            setMsg({ text: 'Could not get all your info. Complete the fields below and click "Let\'s Play".', type: 'warn' });
            setIsGoogleLoading(false);
          }
        } catch {
          setMsg({ text: 'Could not fetch your Google profile. Try the manual form.', type: 'err' });
          setIsGoogleLoading(false);
        }
      }
    });
    client.requestAccessToken();
  };

  const handleAdminSubmit = () => {
    if (!adminCode) {
      setAdminMsg({ text: 'Please enter the admin code.', type: 'warn' });
      return;
    }
    if (adminCode === ADMIN_PASSWORD) {
      setAdminMsg({ text: '✅ Access granted — redirecting…', type: 'ok' });
      sessionStorage.setItem('admin_auth', '1');
      setTimeout(() => { window.location.href = 'admin.html'; }, 700);
    } else {
      setAdminMsg({ text: '❌ Incorrect code. Try again.', type: 'err' });
      setAdminCode('');
    }
  };

  const goToGame = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    window.location.href = 'index.html';
  };

  // --- Render Helpers ---
  const Particles = () => {
    const [particles, setParticles] = useState<any[]>([]);
    useEffect(() => {
      const p = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: 4 + Math.random() * 9,
        left: Math.random() * 100,
        duration: 10 + Math.random() * 18,
        delay: Math.random() * 14,
        color: Math.random() > 0.5 ? '#ff9a42' : '#ff6b00'
      }));
      setParticles(p);
    }, []);

    return (
      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              background: p.color,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_40%,#0a0a22_0%,#000_100%)] flex flex-col items-center justify-center font-['Nunito',sans-serif] overflow-hidden text-white">
      <Head>
        <title>Survive the Month — Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>
      
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />

      <Particles />

      {/* Fullscreen Button */}
      {!isFullscreen && (
        <button id="fs-btn" onClick={toggleFullscreen}>
          <div className="fs-tag">BEST EXPERIENCE</div>
          <div className="fs-pill">
            <div className="fs-icon">{isFullscreen ? '✕' : '⛶'}</div>
            <div className="fs-label">{isFullscreen ? 'EXIT FULLSCREEN' : 'GO FULLSCREEN'}</div>
            <div className="fs-arrow">▼</div>
          </div>
          <div className="fs-dot" />
        </button>
      )}

      {/* Main Container */}
      <div className="container relative z-10 flex flex-col items-center gap-2 w-full px-4 py-6">
        <h1 className="logo font-['Fredoka_One',cursive] text-[clamp(32px,6vw,54px)] text-[#ff9a42] [text-shadow:0_0_60px_rgba(255,120,0,0.5)] tracking-[2px] text-center animate-fadeDown">
          Survive the Month
        </h1>
        <p className="subtitle font-['Fredoka_One',cursive] text-[13px] tracking-[5px] uppercase text-[rgba(255,154,66,0.45)] mb-3 animate-fadeDown delay-200">
          The Financial Survival Game
        </p>

        {/* Warning Banner */}
        <div className="warning-banner max-w-[500px] w-[95vw] bg-[linear-gradient(135deg,rgba(255,193,7,0.15),rgba(255,120,0,0.1))] border-2 border-[rgba(255,193,7,0.6)] rounded-[14px] p-[14px_18px] flex items-start gap-3 mb-[10px] animate-fadeDown delay-300 shadow-[0_0_24px_rgba(255,193,7,0.15),inset_0_1px_0_rgba(255,193,7,0.1)]">
          <span className="warning-icon text-[26px] shrink-0 leading-none mt-[2px] [filter:drop-shadow(0_0_6px_rgba(255,193,7,0.6))]">⚠️</span>
          <div className="warning-text flex flex-col gap-[3px]">
            <span className="warning-title font-['Fredoka_One',cursive] text-[15px] text-[#ffe082] tracking-[0.5px]">IMPORTANT NOTICE</span>
            <span className="warning-body font-['Nunito',sans-serif] text-[12.5px] text-[rgba(255,224,130,0.8)] leading-[1.55]">
              This game involves <strong>financial scenarios</strong>. Your choices will determine if you make it to the end of the month.
            </span>
          </div>
        </div>

        {/* Registration Card */}
        <div className="card bg-[rgba(255,255,255,0.03)] border border-[rgba(255,154,66,0.2)] rounded-[22px] p-[36px_44px_40px] max-w-[500px] w-[95vw] relative shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,154,66,0.08)] animate-cardUp">
          <div className="card-top-line absolute top-[-1px] left-[40px] right-[40px] h-[2px] bg-[linear-gradient(90deg,transparent,#ff9a42,transparent)]" />
          
          <h2 className="card-title font-['Fredoka_One',cursive] text-[19px] text-white mb-1">Create Your Player</h2>
          <p className="card-sub font-['Nunito',sans-serif] text-[13px] text-[rgba(255,255,255,0.38)] mb-6 leading-[1.5]">Enter your details to begin your survival journey.</p>

          {/* Social Login */}
          <div className="social-btns flex flex-col gap-[10px] mb-5">
            <button 
              id="google-btn" 
              className="social-btn flex items-center justify-center gap-[10px] w-full p-[12px_16px] rounded-[12px] border-[1.5px] border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] font-['Fredoka_One',cursive] text-[16px] text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isSubmitting}
            >
              {isGoogleLoading ? (
                <><span className="spinner" />Connecting...</>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>

          <div className="divider flex items-center gap-3 my-[18px]">
            <div className="divider-line flex-1 h-[1px] bg-[rgba(255,255,255,0.08)]" />
            <span className="divider-text font-['Fredoka_One',cursive] text-[11px] text-[rgba(255,255,255,0.25)] uppercase tracking-[2px] whitespace-nowrap">OR USE EMAIL</span>
            <div className="divider-line flex-1 h-[1px] bg-[rgba(255,255,255,0.08)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>
            <div className="field-row flex gap-3 mb-[14px]">
              <div className="field flex flex-col gap-[6px] flex-1">
                <label className="font-['Fredoka_One',cursive] text-[11px] text-[rgba(255,154,66,0.7)] uppercase tracking-[1.5px]">First Name</label>
                <input 
                  type="text" 
                  placeholder="Jane" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`bg-[rgba(255,255,255,0.06)] border-[1.5px] rounded-[12px] p-[12px_15px] font-['Nunito',sans-serif] text-[15px] text-white outline-none w-full transition-all focus:border-[#ff9a42] focus:bg-[rgba(255,154,66,0.06)] focus:shadow-[0_0_0_3px_rgba(255,154,66,0.12)] ${errors.firstName ? 'border-[#e53935] bg-[rgba(229,57,53,0.06)]' : 'border-[rgba(255,154,66,0.18)]'}`}
                />
              </div>
              <div className="field flex flex-col gap-[6px] flex-1">
                <label className="font-['Fredoka_One',cursive] text-[11px] text-[rgba(255,154,66,0.7)] uppercase tracking-[1.5px]">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Smith" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`bg-[rgba(255,255,255,0.06)] border-[1.5px] rounded-[12px] p-[12px_15px] font-['Nunito',sans-serif] text-[15px] text-white outline-none w-full transition-all focus:border-[#ff9a42] focus:bg-[rgba(255,154,66,0.06)] focus:shadow-[0_0_0_3px_rgba(255,154,66,0.12)] ${errors.lastName ? 'border-[#e53935] bg-[rgba(229,57,53,0.06)]' : 'border-[rgba(255,154,66,0.18)]'}`}
                />
              </div>
            </div>

            <div className="field flex flex-col gap-[6px] mb-[14px]">
              <label className="font-['Fredoka_One',cursive] text-[11px] text-[rgba(255,154,66,0.7)] uppercase tracking-[1.5px]">Email Address</label>
              <input 
                type="email" 
                placeholder="jane@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-[rgba(255,255,255,0.06)] border-[1.5px] rounded-[12px] p-[12px_15px] font-['Nunito',sans-serif] text-[15px] text-white outline-none w-full transition-all focus:border-[#ff9a42] focus:bg-[rgba(255,154,66,0.06)] focus:shadow-[0_0_0_3px_rgba(255,154,66,0.12)] ${errors.email ? 'border-[#e53935] bg-[rgba(229,57,53,0.06)]' : 'border-[rgba(255,154,66,0.18)]'}`}
              />
            </div>

            {msg.text && (
              <div className={`msg rounded-[10px] p-[9px_14px] text-[13px] mt-3 leading-[1.5] text-center ${
                msg.type === 'err' ? 'bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.3)] text-[#ef9a9a]' : 
                msg.type === 'ok' ? 'bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)] text-[#a5d6a7]' : 
                'bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.3)] text-[#fff176]'
              }`}>
                {msg.text}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn w-full mt-[22px] p-[14px] bg-[linear-gradient(90deg,#ff9a42,#ff6b00)] border-none rounded-[14px] font-['Fredoka_One',cursive] text-[20px] text-white cursor-pointer transition-all shadow-[0_8px_32px_rgba(255,120,0,0.4)] hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(255,120,0,0.55)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? <><span className="spinner" />Saving...</> : "Let's Play →"}
            </button>
          </form>

          {/* Admin Section */}
          <div className="divider flex items-center gap-3 my-[18px] mt-8">
            <div className="divider-line flex-1 h-[1px] bg-[rgba(255,255,255,0.08)]" />
            <span className="divider-text font-['Fredoka_One',cursive] text-[11px] text-[rgba(255,255,255,0.25)] uppercase tracking-[2px] whitespace-nowrap">ADMIN ACCESS</span>
            <div className="divider-line flex-1 h-[1px] bg-[rgba(255,255,255,0.08)]" />
          </div>

          <div className="admin-row flex gap-[10px] items-end">
            <div className="field flex flex-col gap-[6px] flex-1">
              <label className="font-['Fredoka_One',cursive] text-[11px] text-[rgba(255,154,66,0.7)] uppercase tracking-[1.5px]">Admin Code</label>
              <input 
                type="password" 
                placeholder="Enter admin code..." 
                maxLength={64}
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminSubmit()}
                className="bg-[rgba(255,255,255,0.06)] border-[1.5px] border-[rgba(255,154,66,0.18)] rounded-[12px] p-[12px_15px] font-['Nunito',sans-serif] text-[15px] text-white outline-none w-full transition-all focus:border-[#ff9a42] focus:bg-[rgba(255,154,66,0.06)]"
              />
            </div>
            <button 
              className="admin-btn h-[42px] px-[18px] shrink-0 bg-[rgba(255,255,255,0.06)] border-[1.5px] border-[rgba(255,255,255,0.15)] rounded-[12px] font-['Fredoka_One',cursive] text-[14px] text-[rgba(255,255,255,0.5)] cursor-pointer transition-all hover:bg-[rgba(255,154,66,0.12)] hover:border-[#ff9a42] hover:text-[#ff9a42]"
              onClick={handleAdminSubmit}
            >
              Enter →
            </button>
          </div>
          
          {adminMsg.text && (
            <div className={`msg rounded-[10px] p-[9px_14px] text-[13px] mt-3 leading-[1.5] text-center ${
              adminMsg.type === 'err' ? 'bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.3)] text-[#ef9a9a]' : 
              adminMsg.type === 'ok' ? 'bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)] text-[#a5d6a7]' : 
              'bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.3)] text-[#fff176]'
            }`}>
              {adminMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* Success Screen Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] bg-[radial-gradient(ellipse_at_50%_50%,#0a1a0a,#000)] flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
          <div className="s-emoji text-[72px] mb-[14px] animate-pop">🎉</div>
          <div className="s-title font-['Fredoka_One',cursive] text-[40px] text-[#a5d6a7] [text-shadow:0_0_40px_rgba(76,175,80,0.5)] mb-[6px]">You're In!</div>
          <div className="s-name font-['Fredoka_One',cursive] text-[22px] text-[#ff9a42] mb-3">{successData.name}</div>
          <div className="s-sub font-['Nunito',sans-serif] text-[14px] text-[rgba(255,255,255,0.45)] max-w-[360px] leading-[1.65] mb-7">Welcome to Survive the Month. 30 days. One budget. Good luck.</div>
          <button 
            className="play-btn p-[15px_56px] bg-[linear-gradient(90deg,#ff9a42,#ff6b00)] border-none rounded-[16px] font-['Fredoka_One',cursive] text-[22px] text-white cursor-pointer shadow-[0_8px_32px_rgba(255,120,0,0.5)] transition-all animate-btnPulse hover:scale-[1.05]"
            onClick={goToGame}
          >
            Start the Game →
          </button>
          <div className="s-count font-['Nunito',sans-serif] text-[12px] text-[rgba(255,255,255,0.28)] mt-3">
            {successData.total && `Player #${successData.total} — thanks for playing! • `}
            Auto-starting in {countdown}s…
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(110vh) scale(0.5); }
          15%  { opacity: 0.18; }
          85%  { opacity: 0.08; }
          100% { opacity: 0; transform: translateY(-20vh) scale(1.3); }
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: floatUp linear infinite;
          pointer-events: none;
        }
        .particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        #fs-btn {
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          animation: slideInRight 0.9s 1.2s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateY(-50%) translateX(60px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        .fs-pill {
          background: linear-gradient(135deg, #ff9a42, #ff5500);
          border-radius: 18px 0 0 18px;
          padding: 20px 18px 20px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          box-shadow: -6px 0 40px rgba(255, 120, 0, 0.55), inset 1px 0 0 rgba(255,255,255,0.15);
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
        }
        .fs-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: translateX(-100%);
          animation: shimmer 2.8s ease infinite;
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(200%); }
          100% { transform: translateX(200%); }
        }
        .fs-pill::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 22px 0 0 22px;
          border: 2px solid rgba(255, 154, 66, 0.5);
          animation: ringPulse 2s ease infinite;
          pointer-events: none;
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
        #fs-btn:hover .fs-pill {
          padding-right: 22px;
          box-shadow: -10px 0 60px rgba(255, 120, 0, 0.8), inset 1px 0 0 rgba(255,255,255,0.2);
        }
        .fs-icon {
          font-size: 28px;
          line-height: 1;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.4));
          animation: iconBounce 2s ease infinite;
        }
        @keyframes iconBounce {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.15); }
        }
        .fs-label {
          font-family: 'Fredoka One', cursive;
          font-size: 11px;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          line-height: 1.3;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .fs-arrow { font-size: 13px; color: rgba(255,255,255,0.7); }
        .fs-tag {
          background: rgba(255,193,7,0.92);
          color: #1a0a00;
          font-family: 'Fredoka One', cursive;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 8px 0 0 0;
          white-space: nowrap;
          box-shadow: -3px -2px 12px rgba(255,193,7,0.4);
          margin-bottom: -2px;
          align-self: flex-end;
          animation: tagPulse 2s ease infinite;
        }
        @keyframes tagPulse { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; } }
        .fs-dot {
          width: 10px; height: 10px;
          background: #ffe082;
          border-radius: 50%;
          box-shadow: 0 0 8px #ffe082, 0 0 20px rgba(255,224,130,0.6);
          animation: dotBlink 1.4s ease infinite;
          margin-top: 8px;
          align-self: center;
        }
        @keyframes dotBlink { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.6); } }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeDown { animation: fadeDown 0.9s cubic-bezier(.4,2,.6,1) both; }
        .animate-cardUp { animation: cardUp 0.8s 0.7s ease both; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.45s; }

        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 6px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes btnPulse { 0%,100% { box-shadow: 0 8px 32px rgba(255,120,0,0.4); } 50% { box-shadow: 0 8px 48px rgba(255,120,0,0.7); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease both; }
        .animate-pop { animation: pop 0.6s 0.3s cubic-bezier(.4,2,.6,1) both; }
      `}</style>
    </div>
  );
}