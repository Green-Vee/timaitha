import { NextResponse } from "next/server";
import youtubedl from "youtube-dl-exec";

// 1. Handles GET requests (e.g., testing directly in your browser URL bar)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "money";

  try {
    const output = await youtubedl(
      `ytsearch5:${query}`,
      {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
      },
      {
        execPath: "yt-dlp",
      },
    );

    const entries = output.entries || [output];
    const searchResults = entries.map((entry) => ({
      videoId: entry.id,
      title: entry.title,
      artist: entry.uploader || "Unknown Artist",
      thumbnail: entry.thumbnail,
      audioUrl: entry.url,
      videoEmbedUrl: `https://www.youtube.com/embed/${entry.id}`,
      duration: entry.duration,
    }));

    return NextResponse.json({ success: true, results: searchResults });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// 2. Handles POST requests (from your frontend search component)
export async function POST(request) {
  try {
    let query = "money";

    try {
      const body = await request.json();
      if (body && body.query) {
        query = body.query;
      }
    } catch (e) {
      // Fallback if body is empty
    }

    console.log(`[Timaitha Extractor] Searching for: "${query}"`);

    const output = await youtubedl(
      `ytsearch5:${query}`,
      {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
      },
      {
        execPath: "yt-dlp",
      },
    );

    const entries = output.entries || [output];
    if (!entries.length) {
      return NextResponse.json(
        { success: false, error: "No tracks found on the internet" },
        { status: 404 },
      );
    }

    const searchResults = entries.map((entry) => ({
      videoId: entry.id,
      title: entry.title,
      artist: entry.uploader || "Unknown Artist",
      thumbnail: entry.thumbnail,
      audioUrl: entry.url,
      videoEmbedUrl: `https://www.youtube.com/embed/${entry.id}`,
      duration: entry.duration,
    }));

    return NextResponse.json({
      success: true,
      results: searchResults,
    });
  } catch (error) {
    console.error("Timaitha Extractor Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
