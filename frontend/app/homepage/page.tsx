'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  const [savedUser, setSavedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Double check we are executing safely inside the browser window
    if (typeof window !== 'undefined') {
      const user = sessionStorage.getItem("username");
      const passedLogin = sessionStorage.getItem("passedLogin") === "true";

      if (user && passedLogin) {
        // Safe navigation sequence confirmed
        setSavedUser(user);
        setLoading(false);
      } else {
        // Reload or jump-ahead detected: reset session entirely and force register
        sessionStorage.clear();
        router.replace('/register');
      }
    }
  }, [router]);

  // Keep the UI empty or matching the background while the redirect resolves instantly
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff8c00',
        background: '#050505',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>
        LOADING SIMULATION...f
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: 'white', fontFamily: 'sans-serif', minHeight: '100vh', background: '#050505' }}>
      <h1 style={{ color: '#ff8c00' }}>Survive The Month</h1>
      <p>
        Welcome to the simulation, <strong>{savedUser}</strong>!
      </p>

      <div style={{
        border: '1px solid #ff8c00',
        padding: '1rem',
        marginTop: '1rem',
        borderRadius: '8px',
        background: 'rgba(255,140,0,0.1)'
      }}>
        [ Game Canvas / Core Interface Active ]
      </div>
      
      <button 
        onClick={() => {
          sessionStorage.clear();
          router.replace('/register');
        }}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          background: '#ff8c00',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Log Out / Reset
      </button>
    </div>
  );
}