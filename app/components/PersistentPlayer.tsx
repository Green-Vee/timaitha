/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Download, X } from "lucide-react";

interface ITrack {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
}

interface PersistentPlayerProps {
  currentTrack: ITrack | null;
  onClosePlayer: () => void;
}

export default function PersistentPlayer({
  currentTrack,
  onClosePlayer,
}: PersistentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

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
  }, [currentTrack]);

  if (!currentTrack) return null;

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDownloadCurrent = async () => {
    try {
      const response = await fetch(currentTrack.audioUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${currentTrack.title} - ${currentTrack.artist}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(currentTrack.audioUrl, "_blank");
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    onClosePlayer();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-6 py-4 shadow-2xl animate-slideUp">
      <audio ref={audioRef} />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative">
        {/* Track Info */}
        <div className="flex items-center space-x-3 w-full sm:w-1/4">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-12 h-12 object-cover rounded-xl border border-slate-700/80 shadow"
          />
          <div className="truncate">
            <h4 className="text-sm font-bold text-white truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Player Controls & Scrubber */}
        <div className="flex flex-col items-center w-full sm:w-1/2 space-y-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="translate-x-0.5" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-3 w-full text-xs text-slate-400 font-medium">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right side: Download Button & Close Player Icon */}
        <div className="flex items-center justify-end space-x-3 w-full sm:w-1/4">
          <button
            onClick={handleDownloadCurrent}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-800 transition flex items-center space-x-2 shadow-sm group"
            title="Download Track"
          >
            <Download
              size={15}
              className="text-indigo-400 group-hover:scale-110 transition"
            />
            <span>Download</span>
          </button>

          {/* Close Player Button */}
          <button
            onClick={handleClose}
            className="bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 p-2.5 rounded-xl border border-slate-800 transition shadow-sm"
            title="Close Player"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
