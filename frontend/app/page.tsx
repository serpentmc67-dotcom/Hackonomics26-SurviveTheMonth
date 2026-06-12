'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

function ClientAuthChecker() {
  const router = useRouter();

  // Safely check memory only when the client-side component mounts
  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (!savedUser) {
      router.replace('/register');
    }
  }, [router]);

  // Read local storage to decide what UI elements to return safely
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem("username");

    if (savedUser) {
      return (
        <div style={{ padding: '2rem', color: 'white', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ff8c00' }}>Survive The Month</h1>
          <p>Welcome back, <strong>{savedUser}</strong>!</p>
          <div style={{ border: '1px solid #ff8c00', padding: '1rem', marginTop: '1rem', borderRadius: '8px', background: 'rgba(255,140,0,0.1)' }}>
            [ Game Canvas / Core Interface Active ]
          </div>
        </div>
      );
    }
  }

  // Fallback while the page handles redirection
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#ff8c00', background: '#050505', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
      LOADING SIMULATION...
    </div>
  );
}

// Keep it dynamic with SSR disabled to hide it from pre-rendering engines
const RootPage = dynamic(() => Promise.resolve(ClientAuthChecker), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#ff8c00', background: '#050505', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
      LOADING SIMULATION...
    </div>
  )
});

export default RootPage;
