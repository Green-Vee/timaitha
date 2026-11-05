import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Track from "@/models/Track";

const dummyTracks = [
  {
    title: "Midnight City Beats",
    artist: "Neon Wave",
    genre: "Synthwave",
    coverUrl:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 210,
    downloadCount: 42,
  },
  {
    title: "Summer Breeze",
    artist: "Acoustic Dreams",
    genre: "Chillout",
    coverUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 185,
    downloadCount: 128,
  },
  {
    title: "Deep House Vibes",
    artist: "DJ Pulse",
    genre: "Electronic",
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 240,
    downloadCount: 75,
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing tracks (optional) and insert sample tracks
    await Track.deleteMany({});
    const insertedTracks = await Track.insertMany(dummyTracks);

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully!",
        count: insertedTracks.length,
        data: insertedTracks,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}


