/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Play, Download } from "lucide-react";

interface ITrack {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
}

interface TrackGridProps {
  tracks: ITrack[];
  onPlayTrack: (track: ITrack) => void;
}

export default function TrackGrid({ tracks, onPlayTrack }: TrackGridProps) {
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
    } catch (err) {
      window.open(track.audioUrl, "_blank");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FEATURED TRACKS
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Discover trending tracks uploaded recently.
          </p>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-slate-800 rounded-2xl">
          Loading library tracks...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <div
              key={track._id}
              onClick={() => onPlayTrack(track)}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition group cursor-pointer flex flex-col justify-between shadow-xl"
            >
              {/* Cover Art & Play Overlay */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-800 mb-3">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition">
                    <Play size={20} className="translate-x-0.5 fill-white" />
                  </div>
                </div>
              </div>

              {/* Meta & Download Action */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                    {track.genre || "General"}
                  </span>

                  {/* Clean Vector Download Button */}
                  <button
                    onClick={(e) => handleDownload(e, track)}
                    title="Download Track"
                    className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-indigo-600 p-2 rounded-xl transition shadow-sm"
                  >
                    <Download size={15} />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base truncate mt-1">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {track.artist}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
