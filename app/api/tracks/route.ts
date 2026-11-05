import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { v2 as cloudinary } from "cloudinary";
import Track from "@/models/Track";

// Configure Cloudinary using your environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch all tracks from MongoDB
export async function GET() {
  try {
    await dbConnect();
    const tracks = await Track.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tracks });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

// Handle POST requests from the dashboard form
//Adding a Track to the database and uploading the files to Cloudinary
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Ensure genre has a fallback value if left empty in the form
    const trackData = {
      ...body,
      genre:
        body.genre && body.genre.trim() !== "" ? body.genre.trim() : "General",
    };

    const newTrack = await Track.create(trackData);

    return NextResponse.json(
      {
        success: true,
        message: "Track successfully saved to the database!",
        data: newTrack,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error saving track:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

// Delete a track by ID
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Track ID is required" },
        { status: 400 },
      );
    }

    await Track.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Track deleted successfully",
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

// Update an existing track
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { id, title, artist, genre, coverUrl, audioUrl } =
      await request.json();

    const updatedTrack = await Track.findByIdAndUpdate(
      id,
      {
        title,
        artist,
        genre: genre && genre.trim() !== "" ? genre.trim() : "General",
        ...(coverUrl && { coverUrl }),
        ...(audioUrl && { audioUrl }),
      },
      { new: true },
    );

    return NextResponse.json({ success: true, data: updatedTrack });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
