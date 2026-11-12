/* eslint-disable @next/next/no-img-element */
"use client";

interface ITrack {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
  createdAt: string;
}

interface TrackListProps {
  tracks: ITrack[];
  playingTrackId: string | null;
  onTogglePlay: (id: string) => void;
  onEdit: (track: ITrack) => void; // <-- Ensure this accepts ITrack
  onDelete: (id: string) => void;
  onSelectTrack: (track: ITrack) => void; // <-- Ensure this accepts ITrack
}

export default function TrackList({
  tracks = [],
  onSelectTrack,
}: TrackListProps) {
  return (
    <div className="space-y-6">
      {/* Track Grid */}
      {tracks.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
          <p className="mb-2 text-lg font-semibold text-white">
            No tracks in your library yet.
          </p>
          <p className="text-sm text-slate-400">
            Click the upload button above to add your first track!
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {tracks.map((track) => (
            <div
              key={track._id}
              onClick={() => onSelectTrack(track)}
              className="group relative flex items-center justify-between cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-xl transition duration-300 hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-950/30 gap-4"
            >
              {/* Left Side: Thumbnail & Info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Compact Cover Art */}
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="text-[10px] font-bold text-white">
                      View
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <span className="inline-flex rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    {track.genre || "General"}
                  </span>
                  <h3 className="truncate text-base font-bold text-white group-hover:text-indigo-400 transition mt-1">
                    {track.title}
                  </h3>
                  <p className="truncate text-xs text-slate-400">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Right Side Action Indicator */}
              <div className="flex items-center pr-2 text-slate-400 group-hover:text-indigo-400 transition">
                <span className="text-xs font-semibold hidden sm:inline-block">
                  View details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
