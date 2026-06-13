'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesCore } from '@/components/ui/sparkles';
import { Stethoscope, Zap } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0d1a26] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Sparkles full background */}
      <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id="tsparticles-landing"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#1a9bbf"
          speed={1.2}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[2px] w-3/4 blur-sm opacity-60" />
      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px w-3/4 opacity-60" />

      {/* Nav bar — fades in first (0s) */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 py-4 md:py-5 z-20"
      >
        <div className="flex items-center gap-2">
          <Stethoscope className="text-cyan-400" size={22} />
          <span className="text-lg font-bold tracking-wide text-cyan-300">Qureon</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            id="nav-login-btn"
            onClick={onLogin}
            className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-cyan-300 border border-cyan-700 rounded-lg hover:bg-cyan-900/30 transition-all"
          >
            Login
          </button>
          <button
            id="nav-register-btn"
            onClick={onRegister}
            className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:brightness-110 transition-all"
          >
            Register
          </button>
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 max-w-full">

        {/* Badge — appears at 0.3s */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="mb-6 inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full border border-cyan-700/60 bg-cyan-900/20 text-cyan-300 text-xs md:text-sm font-medium max-w-[90vw] text-center"
        >
          <Zap size={13} className="text-cyan-400 flex-shrink-0" />
          <span>AI-Powered Health Intelligence Platform</span>
        </motion.div>

        {/* Main heading "Qureon" — appears at 0.6s */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-center leading-tight tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-cyan-100 to-cyan-400">
            Qureon
          </span>
        </motion.h1>

        {/* Sparkles animation strip — appears with heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-[36rem] max-w-full h-24 relative -mt-2 mb-2"
        >
          <div className="absolute inset-x-16 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-16 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-48 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-48 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
          <div className="absolute inset-0 w-full h-full bg-[#0d1a26] [mask-image:radial-gradient(300px_150px_at_top,transparent_20%,white)]" />
        </motion.div>

        {/* Subtitle — appears after 5s with a slow graceful fade */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1, ease: 'easeOut' }}
          className="text-lg md:text-xl text-cyan-100/70 max-w-xl mt-2 leading-relaxed"
        >
          Your intelligent companion for disease awareness, medical report analysis, and real-time health alerts.
        </motion.p>

        {/* Feature chips — appears after subtitle at 6.5s */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 2.5, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10 medical-badges"
        >
          <span>🩺 Health Chat</span>
          <span>🧬 Report Analysis</span>
          <span>🔔 Disease Alerts</span>
          <span>🛡️ Secure &amp; Private</span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d1a26] to-transparent pointer-events-none" />
    </div>
  );
}
