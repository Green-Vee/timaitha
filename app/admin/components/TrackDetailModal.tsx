/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";

interface ITrack {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
  createdAt: string;
  downloads?: number;
  rating?: number;
}

interface TrackDetailModalProps {
  track: ITrack | null;
  onClose: () => void;
  onEdit: (track: ITrack) => void;
  onDelete: (id: string) => void;
}

export default function TrackDetailModal({
  track,
  onClose,
  onEdit,
  onDelete,
}: TrackDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset playback state when track changes or modal closes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [track]);

  // Sync audio progress within the modal player
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [track]);

  if (!track) return null;

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
  <div className="bg-slate-950 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-white/20 text-white my-8">
    {/* Modal Header */}
    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/50">
      <h3 className="text-lg font-bold text-white tracking-wide">
        Track Details & Player
      </h3>
      <button
        onClick={() => {
          if (audioRef.current) audioRef.current.pause();
          onClose();
        }}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition shadow-sm"
      >
        ✕
      </button>
    </div>

    {/* Modal Body */}
    <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      {/* Top Section: Responsive Cover & Info layout */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative h-48 w-full sm:w-48 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 mb-2 sm:mb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center sm:text-left space-y-2.5 w-full">
          <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20">
            {track.genre || "General"}
          </span>
          <h2 className="text-2xl font-bold text-white truncate">
            {track.title}
          </h2>
          <p className="text-slate-400 font-medium text-sm">
            {track.artist}
          </p>

          {/* Stats Bar: Downloads & Ratings */}
          <div className="flex justify-center sm:justify-start gap-3 pt-2">
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Downloads
              </p>
              <p className="text-sm font-bold text-white">
                {track.downloads ?? 142}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Rating</p>
              <p className="text-sm font-bold text-amber-400">
                ⭐ {track.rating ?? "4.8"}/5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Audio Player Controls Component */}
      <div className="bg-slate-900 border border-slate-800 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-inner">
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          onClick={togglePlayPause}
          className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition flex items-center justify-center space-x-2 text-white ${
            isPlaying
              ? "bg-amber-600 hover:bg-amber-500"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          <span className="text-sm tracking-wide">
            {isPlaying ? "⏸ Pause Track" : "▶ Play Track Preview"}
          </span>
        </button>
      </div>

      {/* Edit & Delete Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-800">
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            onEdit(track);
          }}
          className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white py-3 rounded-xl font-semibold transition text-sm"
        >
          Edit Track
        </button>
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            onDelete(track._id);
          }}
          className="flex-1 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white py-3 rounded-xl font-semibold transition text-sm"
        >
          Delete Track
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
