import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; season: string }> }
) {
  const { id, season } = await params;
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${TMDB_API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return NextResponse.json({ episodes: data.episodes || [] });
}
