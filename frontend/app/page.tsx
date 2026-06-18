'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

function ClientAuthChecker() {
  const router = useRouter();
  const [savedUser, setSavedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("username");

    if (!user) {
      router.replace('/register');
      return;
    }

    setSavedUser(user);
    setLoading(false);
  }, [router]);

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
        fontWeight: 'bold'
      }}>
        LOADING SIMULATION...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#ff8c00' }}>Survive The Month</h1>
      <p>
        Welcome back, <strong>{savedUser}</strong>!
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
    </div>
  );
}

const RootPage = dynamic(() => Promise.resolve(ClientAuthChecker), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ff8c00',
      background: '#050505',
      fontFamily: 'sans-serif',
      fontWeight: 'bold'
    }}>
      LOADING SIMULATION...
    </div>
  )
});

export default RootPage;