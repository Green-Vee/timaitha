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
  onEdit: (track: ITrack) => void;         // <-- Ensure this accepts ITrack
  onDelete: (id: string) => void;
  onSelectTrack: (track: ITrack) => void;   // <-- Ensure this accepts ITrack
}

export default function TrackList({
  tracks = [],
  onSelectTrack,
}: TrackListProps) {
  return (
    <div className="space-y-6">
      {/* Track Grid */}
      {tracks.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-lg mb-2">No tracks in your library yet.</p>
          <p className="text-sm">
            Click the upload button above to add your first track!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track._id}
              onClick={() => onSelectTrack(track)}
              className="bg-white rounded-2xl p-4 shadow-xl hover:shadow-2xl transition cursor-pointer border border-gray-100 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Cover Art Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-white/90 text-gray-900 font-semibold px-4 py-2 rounded-full text-sm shadow-md">
                    View Details & Play
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {track.genre || "General"}
                </span>
                <h3 className="font-bold text-gray-900 text-lg mt-2 truncate">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
