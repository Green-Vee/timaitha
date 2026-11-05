/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Play, Download, X } from "lucide-react";

interface ITrack {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
}

interface DiscoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: ITrack[];
  initialQuery?: string;
  onPlayTrack: (track: ITrack) => void;
}

export default function DiscoverModal({
  isOpen,
  onClose,
  tracks,
  initialQuery = "",
  onPlayTrack,
}: DiscoverModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Sync initial query whenever the modal is triggered from the Hero search
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(initialQuery);
  }, [initialQuery, isOpen]);

  // Extract unique genres dynamically
  const genres = useMemo(() => {
    const allGenres = tracks.map((t) => t.genre || "General");
    return ["All", ...Array.from(new Set(allGenres))];
  }, [tracks]);

  // Filter tracks based on search query and genre selection
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesSearch =
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" || (track.genre || "General") === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [tracks, searchQuery, selectedGenre]);

  const handleDownload = async (e: React.MouseEvent, track: ITrack) => {
    e.stopPropagation();
    try {
      const response = await fetch(track.audioUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${track.title} - ${track.artist}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(track.audioUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Header & Search Bar */}
        <div className="p-6 border-b border-slate-800 space-y-4 bg-slate-950/50">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Music Vault
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight mt-1">
                Discover Sound
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by track title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  selectedGenre === genre
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Track Results Grid */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[60vh]">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-base font-semibold">
                No tracks found matching your search.
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Try checking your spelling or clearing your search filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTracks.map((track) => (
                <div
                  key={track._id}
                  onClick={() => {
                    onPlayTrack(track);
                    onClose();
                  }}
                  className="bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-3 transition group cursor-pointer flex flex-col justify-between shadow-lg"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-900 mb-3">
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition">
                        <Play
                          size={18}
                          className="translate-x-0.5 fill-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                        {track.genre || "General"}
                      </span>
                      <button
                        onClick={(e) => handleDownload(e, track)}
                        title="Download Track"
                        className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                    <h4 className="font-bold text-white text-sm truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
