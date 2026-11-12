"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Flame, Radio, Info, ShieldCheck, Menu, X, Disc3 } from 'lucide-react';

interface NavbarProps {
  onOpenModal: (modalType: "discover" | "charts" | "sessions") => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  // Check if the current device has an active admin session
  useEffect(() => {
    let isMounted = true;

    async function checkAdminStatus() {
      try {
        const res = await fetch('/api/auth/status', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setIsAdmin(Boolean(data.isAuthenticated));
        }
      } catch {
        if (isMounted) setIsAdmin(false);
      }
    }

    checkAdminStatus();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Hide the public navbar on admin pages for a clean dashboard view
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleModalClick = (type: "discover" | "charts" | "sessions") => {
    onOpenModal(type);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Spinning Vinyl & Hover Glow */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-500/60 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Disc3 size={22} className="text-white animate-[spin_8s_linear_infinite] group-hover:animate-[spin_2s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-500 leading-none group-hover:tracking-widest transition-all duration-300">
              TIMAITHA
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              Audio Vault
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Micro-Interactions */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 border border-white/10 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => handleModalClick("discover")}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Compass size={15} className="text-blue-400 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300" />
            <span>DISCOVER</span>
          </button>
          
          <button
            onClick={() => handleModalClick("charts")}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Flame size={15} className="text-amber-400 group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300" />
            <span>CHARTS</span>
          </button>

          <button
            onClick={() => handleModalClick("sessions")}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Radio size={15} className="text-emerald-400 animate-pulse group-hover:scale-125 transition-transform duration-300" />
            <span>LIVE SESSIONS</span>
          </button>

          <a
            href="#about"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Info size={15} className="text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
            <span>ABOUT</span>
          </a>
        </nav>

        {/* Desktop Control Center Action Button (Visible ONLY when logged in) */}
        {isAdmin && (
          <div className="hidden md:flex items-center">
            <Link
              href="/admin"
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 border border-white/15 overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <ShieldCheck size={16} className="text-blue-200 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200" />
              <span>Control Center</span>
            </Link>
          </div>
        )}

        {/* Animated Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 active:scale-90 transition-all duration-200"
          >
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </div>
          </button>
        </div>
      </div>

      {/* Smooth Slide-Down Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[420px] opacity-100 border-b border-white/10' : 'max-h-0 opacity-0 border-b-0'
        }`}
      >
        <div className="bg-slate-950/95 backdrop-blur-2xl px-6 py-5 space-y-2.5 shadow-2xl">
          <button
            onClick={() => handleModalClick("discover")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-bold tracking-wide hover:bg-slate-800 hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
          >
            <Compass size={18} className="text-blue-400" />
            <span>DISCOVER</span>
          </button>

          <button
            onClick={() => handleModalClick("charts")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-bold tracking-wide hover:bg-slate-800 hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
          >
            <Flame size={18} className="text-amber-400" />
            <span>CHARTS</span>
          </button>

          <button
            onClick={() => handleModalClick("sessions")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-bold tracking-wide hover:bg-slate-800 hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
          >
            <Radio size={18} className="text-emerald-400 animate-pulse" />
            <span>LIVE SESSIONS</span>
          </button>

          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-bold tracking-wide hover:bg-slate-800 hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
          >
            <Info size={18} className="text-indigo-400" />
            <span>ABOUT</span>
          </a>

          {/* Control Center Button in Mobile Dropdown (Visible ONLY when logged in) */}
          {isAdmin && (
            <div className="pt-2">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all duration-200"
              >
                <ShieldCheck size={16} />
                <span>Control Center</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}