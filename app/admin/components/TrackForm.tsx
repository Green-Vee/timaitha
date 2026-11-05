"use client";

import { useState, useEffect } from "react";
import { Disc3, Upload, Image as ImageIcon, Sparkles, X } from "lucide-react";

interface TrackFormProps {
  title: string;
  setTitle: (val: string) => void;
  artist: string;
  setArtist: (val: string) => void;
  genre: string;
  setGenre: (val: string) => void;
  setCoverFile: (file: File | null) => void;
  setAudioFile: (file: File | null) => void;
  editingTrackId: string | null;
  onCancelEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  statusMessage: string;
}

const GENRE_OPTIONS = [
  "General",
  "Afrobeat",
  "Hip-Hop",
  "Dancehall",
  "Electronic",
  "R&B",
  "Gospel",
  "Acoustic",
];

export default function TrackForm({
  title,
  setTitle,
  artist,
  setArtist,
  genre,
  setGenre,
  setCoverFile,
  setAudioFile,
  editingTrackId,
  onCancelEdit,
  onSubmit,
  isLoading,
  statusMessage,
}: TrackFormProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    } else {
      setCoverPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-1 sm:p-5 rounded-2xl shadow-xl h-fit">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-100">
              {editingTrackId ? "Modify Track" : "Timaitha Exclusie Upload"}
            </h2>
          </div>
        </div>

        {editingTrackId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center space-x-1 text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 transition"
          >
            <X className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-2.5">
        {/* Track Title */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            Track Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            placeholder="e.g., Midnight Groove"
          />
        </div>

        {/* Artist Name */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            Artist Name
          </label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            placeholder="e.g., Alique"
          />
        </div>

        {/* Genre Dropdown */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            Genre
          </label>
          <div className="relative">
            <select
              value={genre || "General"}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none"
            >
              {GENRE_OPTIONS.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  className="bg-slate-900 text-slate-100"
                >
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Cover Image Input & Mini Preview */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Cover Art
            </label>
            {editingTrackId && (
              <span className="text-[10px] text-indigo-400">(optional)</span>
            )}
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="relative w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-4 h-4 text-slate-700" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              required={!editingTrackId}
              className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer"
            />
          </div>
        </div>

        {/* Audio File Input */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Audio File
            </label>
            {editingTrackId && (
              <span className="text-[10px] text-indigo-400">(optional)</span>
            )}
          </div>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            required={!editingTrackId}
            className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-1 py-2.5 px-3 rounded-xl font-semibold text-xs tracking-wide transition shadow-md flex items-center justify-center space-x-2 ${
            editingTrackId
              ? "bg-amber-600 hover:bg-amber-500 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <>
              <Disc3 className="w-3.5 h-3.5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>{editingTrackId ? "Save Changes" : "Upload Track"}</span>
            </>
          )}
        </button>
      </form>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`mt-2.5 p-2 rounded-lg border text-center text-[10px] font-medium ${
            statusMessage.startsWith("Success")
              ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
              : "bg-indigo-950/40 border-indigo-800/60 text-indigo-300"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
