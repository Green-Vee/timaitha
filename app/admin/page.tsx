"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TrackList from "./components/Tracklist";
import TrackForm from "./components/TrackForm";
import TrackDetailModal from "./components/TrackDetailModal";

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

// Simple Reusable Modal Wrapper for the Upload Form
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 text-black">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition"
          >
            ✕
          </button>
        </div>
        <div className="p-1 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<ITrack | null>(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("General");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState("");
  const [existingAudioUrl, setExistingAudioUrl] = useState("");

  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/tracks");
      const result = await res.json();
      if (result.success) setTracks(result.data);
    } catch (err) {
      console.error("Failed to load tracks:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTracks();
  }, []);

  const uploadToCloudinary = async (file: File, folderName: string) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "music_preset");
    formData.append("folder", folderName);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error?.message || "Cloudinary upload failed");
    return data.secure_url;
  };

  const handleOpenUploadModal = () => {
    setEditingTrackId(null);
    setTitle("");
    setArtist("");
    setGenre("General");
    setCoverFile(null);
    setAudioFile(null);
    setExistingCoverUrl("");
    setExistingAudioUrl("");
    setStatusMessage("");
    setIsUploadModalOpen(true);
  };

  const handleStartEditFromDetail = (track: ITrack) => {
    setSelectedTrack(null);
    setEditingTrackId(track._id);
    setTitle(track.title);
    setArtist(track.artist);
    setGenre(track.genre);
    setExistingCoverUrl(track.coverUrl);
    setExistingAudioUrl(track.audioUrl);
    setCoverFile(null);
    setAudioFile(null);
    setStatusMessage("");
    setIsUploadModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingTrackId(null);
    setTitle("");
    setArtist("");
    setGenre("General");
    setCoverFile(null);
    setAudioFile(null);
    setExistingCoverUrl("");
    setExistingAudioUrl("");
    setIsUploadModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(
      editingTrackId ? "Updating track..." : "Uploading files & saving...",
    );

    try {
      let coverUrl = existingCoverUrl;
      let audioUrl = existingAudioUrl;

      if (coverFile) {
        coverUrl = await uploadToCloudinary(coverFile, "timaitha/covers");
      }
      if (audioFile) {
        audioUrl = await uploadToCloudinary(audioFile, "timaitha/tracks");
      }

      if (!editingTrackId && (!coverFile || !audioFile)) {
        setStatusMessage("Please select both a cover image and an audio file.");
        setIsLoading(false);
        return;
      }

      const method = editingTrackId ? "PUT" : "POST";
      const payload: {
        title: string;
        artist: string;
        genre: string;
        coverUrl: string;
        audioUrl: string;
        _id?: string;
      } = {
        title,
        artist,
        genre,
        coverUrl,
        audioUrl,
      };
      if (editingTrackId) payload._id = editingTrackId;

      const res = await fetch("/api/tracks", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatusMessage(
          editingTrackId ? "Success! Track updated." : "Success! Track saved.",
        );
        setTimeout(() => {
          handleCancelEdit();
          setStatusMessage("");
        }, 1000);
        fetchTracks();
      } else {
        setStatusMessage(`Error: ${result.error || "Operation failed"}`);
      }
    } catch (error: unknown) {
      setStatusMessage(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this track?")) return;

    try {
      const res = await fetch(`/api/tracks?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setTracks(tracks.filter((track) => track._id !== id));
        setSelectedTrack(null);
      }
    } catch (err: unknown) {
      alert(
        `Error deleting track: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 p-4 sm:p-8 text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Dashboard Top Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Timaitha Dashboard
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage your music library and audio assets.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-2 rounded-xl border border-indigo-500/30 font-semibold">
              Total Tracks: {tracks.length}
            </span>
            <button
              onClick={handleOpenUploadModal}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>Upload </span>
              <span></span>
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2">
              <span>
                <Link
                  href="/"
                  className="text-xs font-bold tracking-wider uppercase text-white/90 hover:text-white transition"
                >
                  Client
                </Link>
              </span>
            </button>
          </div>
        </div>

        {/* Full-Width Track List Display */}
        <TrackList
          tracks={tracks}
          playingTrackId={null}
          onTogglePlay={() => {}}
          onEdit={(track: ITrack) => setSelectedTrack(track)}
          onDelete={handleDelete}
          onSelectTrack={(track) => setSelectedTrack(track)}
        />
      </div>

      {/* MODAL 1: Upload / Edit Form Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={handleCancelEdit}
        title={editingTrackId ? "Edit Track Details" : "Upload New Track"}
      >
        <TrackForm
          title={title}
          setTitle={setTitle}
          artist={artist}
          setArtist={setArtist}
          genre={genre}
          setGenre={setGenre}
          setCoverFile={setCoverFile}
          setAudioFile={setAudioFile}
          editingTrackId={editingTrackId}
          onCancelEdit={handleCancelEdit}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          statusMessage={statusMessage}
        />
      </Modal>

      {/* MODAL 2: Extracted Track Detail & Player Component */}
      <TrackDetailModal
        track={selectedTrack}
        onClose={() => setSelectedTrack(null)}
        onEdit={handleStartEditFromDetail}
        onDelete={handleDelete}
      />
    </main>
  );
}
