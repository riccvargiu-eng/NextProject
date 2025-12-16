import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET() {
  try {
    const v3 = process.env.TMDB_API_KEY;
    const v4 = process.env.TMDB_API_READ_ACCESS_TOKEN;
    if (!v3 && !v4) {
      console.warn("TMDB_API_KEY not set, returning mock genres");
      return NextResponse.json({
        genres: [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 14, name: "Fantasy" },
          { id: 36, name: "History" },
          { id: 27, name: "Horror" },
          { id: 10402, name: "Music" },
          { id: 9648, name: "Mystery" },
          { id: 10749, name: "Romance" },
          { id: 878, name: "Science Fiction" },
          { id: 10770, name: "TV Movie" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
          { id: 37, name: "Western" },
        ],
      });
    }

    const url = v4
      ? `${TMDB_BASE_URL}/genre/movie/list?language=it-IT`
      : `${TMDB_BASE_URL}/genre/movie/list?api_key=${v3}&language=it-IT`;

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
      console.error("TMDB API error:", res.status, text);
      return NextResponse.json({
        genres: [
          { id: 28, name: "Action" },
          { id: 35, name: "Comedy" },
          { id: 18, name: "Drama" },
          { id: 27, name: "Horror" },
          { id: 878, name: "Science Fiction" },
          { id: 53, name: "Thriller" },
        ],
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in genres API:", err);
    return NextResponse.json({
      genres: [
        { id: 28, name: "Action" },
        { id: 35, name: "Comedy" },
        { id: 18, name: "Drama" },
        { id: 27, name: "Horror" },
        { id: 878, name: "Science Fiction" },
      ],
    });
  }
}
