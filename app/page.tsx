"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrackGrid from "./components/TrackGrid";
import AboutSection from "./components/AboutSection";
import PersistentPlayer from "./components/PersistentPlayer";
import DiscoverModal from "./components/modals/DiscoverModal";

interface ITrack {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
}

export default function Home() {
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<ITrack | null>(null);

  // Modal state & initial query passed from Hero search bar
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("/api/tracks");
        const result = await res.json();
        if (result.success) setTracks(result.data);
      } catch (err) {
        console.error("Failed to load tracks for public page:", err);
      }
    };
    fetchTracks();
  }, []);

  const handleHeroExplore = (query: string) => {
    setInitialSearchQuery(query);
    setIsDiscoverOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 selection:bg-indigo-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        onOpenModal={(type) => {
          if (type === "discover") {
            setInitialSearchQuery("");
            setIsDiscoverOpen(true);
          }
        }}
      />

      {/* 2. Hero Section with Search bar trigger */}
      <HeroSection onExplore={handleHeroExplore} />

      {/* 3. Main Featured Tracks Grid */}
      <TrackGrid
        tracks={tracks}
        onPlayTrack={(track) => setActiveTrack(track)}
      />

      {/* 4. About Timaitha */}
      <AboutSection />

      {/* 5. Results Pop-up Modal with Play & Vector Download Buttons */}
      <DiscoverModal
        isOpen={isDiscoverOpen}
        onClose={() => setIsDiscoverOpen(false)}
        tracks={tracks}
        initialQuery={initialSearchQuery}
        onPlayTrack={(track) => setActiveTrack(track)}
      />

      {/* 6. Persistent Bottom Player */}
      <PersistentPlayer
        currentTrack={activeTrack}
        onClosePlayer={() => setActiveTrack(null)}
      />
    </div>
  );
}
