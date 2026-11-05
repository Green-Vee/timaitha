/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onExplore: (searchQuery: string) => void;
}

export default function HeroSection({ onExplore }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExplore(query);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    onExplore(tag);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Brand & Hero Search Input */}
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            <Sparkles size={13} className="text-indigo-400" />
            <span>The New Frequency of Sound</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            STREAM & EXPLORE UNFILTERED AUDIO.
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl">
            A modern music showcase powered by Timaitha Control Center.
            Experience high-fidelity streams, independent drops, and direct
            audio downloads.
          </p>

          {/* Interactive Hero Search */}
          <div className="pt-2 max-w-xl">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center group"
            >
              <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-400 transition">
                <Search size={20} />
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by track, artist, or genre..."
                className="w-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/80 rounded-2xl pl-12 pr-36 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xl transition backdrop-blur-md"
              />

              <button
                type="submit"
                className="absolute right-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Explore Vault
              </button>
            </form>

            <div className="flex items-center space-x-2 mt-3 text-[11px] text-slate-500 font-medium">
              <span>Popular Tags:</span>
              <button
                type="button"
                className="text-slate-400 hover:text-indigo-400 transition"
                onClick={() => handleTagClick("Afrobeat")}
              >
                #Afrobeat
              </button>
              <button
                type="button"
                className="text-slate-400 hover:text-indigo-400 transition"
                onClick={() => handleTagClick("General")}
              >
                #General
              </button>
              <button
                type="button"
                className="text-slate-400 hover:text-indigo-400 transition"
                onClick={() => handleTagClick("Hip-Hop")}
              >
                #Hip-Hop
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Media Spotlight */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900 aspect-video group">
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
              alt="Studio Spotlight"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-6">
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                  Studio Spotlight
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Timaitha Audio Vault
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
