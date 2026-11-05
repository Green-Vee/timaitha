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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-gray-100 text-black my-8">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Track Details & Player
          </h3>
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

          {/* Top Section: Responsive Cover & Info layout */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="text-center sm:text-left space-y-2 w-full">
              <span className="inline-block text-xs uppercase tracking-wider font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {track.genre || "General"}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 truncate">
                {track.title}
              </h2>
              <p className="text-gray-600 font-medium text-base">
                {track.artist}
              </p>

              {/* Stats Bar: Downloads & Ratings */}
              <div className="flex justify-center sm:justify-start gap-4 pt-2">
                <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-center">
                  <p className="text-xs text-gray-500 font-semibold">
                    Downloads
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {track.downloads ?? 142}
                  </p>
                </div>
                <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-center">
                  <p className="text-xs text-gray-500 font-semibold">Rating</p>
                  <p className="text-sm font-bold text-amber-600">
                    ⭐ {track.rating ?? "4.8"}/5
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Audio Player Controls Component */}
          <div className="bg-gray-900 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-inner">
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <button
              onClick={togglePlayPause}
              className={`w-full py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center space-x-2 text-white ${
                isPlaying
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <span className="text-lg">
                {isPlaying ? "⏸ Pause Track" : "▶ Play Track Preview"}
              </span>
            </button>
          </div>

          {/* Edit & Delete Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t">
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                onEdit(track);
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition"
            >
              Edit Track
            </button>
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                onDelete(track._id);
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Delete Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
