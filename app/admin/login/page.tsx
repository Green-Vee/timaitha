"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, User, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Force a hard navigation so the browser registers the new cookie instantly
        route.refresh();
        route.push("/admin");
      } else {
        setError(data.message || "Invalid administrative credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection failure. Please verify your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Vault Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 text-white space-y-8">
        {/* Top Navigation / Back Link */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/50"
          >
            <ArrowLeft size={14} />
            <span>Catalog</span>
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            <ShieldCheck size={12} />
            <span>ThunderProbuilds</span>
          </div>
        </div>

        {/* Header Title Section */}
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Authenticate to manage the Timaitha audio stream catalog.
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3.5 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Admin Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm outline-none transition shadow-inner"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Security Key / Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm outline-none transition shadow-inner"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all duration-200 mt-3 disabled:opacity-50 flex items-center justify-center gap-2 text-sm tracking-wide active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Session...</span>
              </>
            ) : (
              <span>Unlock Dashboard</span>
            )}
          </button>
        </form>

        {/* Footer Brand Tag */}
        <div className="pt-4 text-center border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            Powered by{" "}
            <span className="text-slate-400 font-semibold">
              ThunderProBuilds Security
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
