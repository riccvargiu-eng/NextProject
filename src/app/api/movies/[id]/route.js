import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const v3 = process.env.TMDB_API_KEY;
    const v4 = process.env.TMDB_API_READ_ACCESS_TOKEN;
    if (!v3 && !v4) {
      console.warn(
        "TMDB_API_KEY not set — returning mock movie data for id",
        id
      );
      const mock = {
        id,
        title: "Mock Movie",
        poster_path: "/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
        overview: "This is mock movie data because TMDB_API_KEY is not set.",
        release_date: "2025-01-01",
        genres: [{ id: 0, name: "Drama" }],
        vote_average: 7.5,
      };
      return NextResponse.json(mock);
    }
    const url = v4
      ? `${TMDB_BASE_URL}/movie/${id}?language=it-IT`
      : `${TMDB_BASE_URL}/movie/${id}?api_key=${v3}&language=it-IT`;

    const res = await fetch(url, {
      headers: v4
        ? {
            Authorization: `Bearer ${v4}`,
            Accept: "application/json",
          }
        : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      // If TMDB returns an auth or other error, fallback to mock data so UI stays usable
      console.error("TMDB response error for movie", id, res.status, text);
      const mock = {
        id,
        title: "Fallback Movie",
        poster_path: "/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
        overview: "Fallback movie data due to upstream API error.",
        release_date: "2025-01-01",
        genres: [{ id: 0, name: "Unknown" }],
        vote_average: 0,
      };
      return NextResponse.json(mock, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
