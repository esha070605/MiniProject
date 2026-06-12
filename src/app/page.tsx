'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import ParticleBackground from '@/components/ParticleBackground';
import LandingPage from '@/components/LandingPage';

type View = 'landing' | 'auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1a26]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Authenticated → go straight to dashboard
  if (user) {
    return (
      <main className="h-screen bg-[#0d1a26] text-white relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 p-4 md:p-8 h-full max-w-7xl mx-auto flex flex-col">
          <Dashboard user={user} />
        </div>
      </main>
    );
  }

  // Unauthenticated → landing or auth screen
  if (view === 'landing') {
    return (
      <LandingPage
        onLogin={() => { setAuthMode('login'); setView('auth'); }}
        onRegister={() => { setAuthMode('register'); setView('auth'); }}
      />
    );
  }

  return (
    <main className="h-screen bg-[#0d1a26] text-white relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 p-4 md:p-8 h-full max-w-7xl mx-auto flex flex-col">
        <AuthScreen
          initialMode={authMode}
          onBackToLanding={() => setView('landing')}
        />
      </div>
    </main>
  );
}
