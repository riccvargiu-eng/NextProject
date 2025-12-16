import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const MOVIES_PER_PAGE = 20;
const MAX_PAGES = 25;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const requestedRating = Number(searchParams.get("rating")) || 0;
    const v3 = process.env.TMDB_API_KEY;
    const v4 = process.env.TMDB_API_READ_ACCESS_TOKEN;

    if (!genre) {
      return NextResponse.json({ results: [], maxAvailableRating: 0 });
    }

    let allMovies = [];
    let maxAvailableRating = 0;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = v4
        ? `${TMDB_BASE_URL}/discover/movie?with_genres=${genre}&language=it-IT&vote_count.gte=10&include_adult=false&page=${page}`
        : `${TMDB_BASE_URL}/discover/movie?api_key=${v3}&with_genres=${genre}&language=it-IT&vote_count.gte=10&include_adult=false&page=${page}`;

      const res = await fetch(url, {
        headers: v4
          ? {
              Authorization: `Bearer ${v4}`,
              Accept: "application/json",
            }
          : undefined,
      });

      if (!res.ok) break;

      const data = await res.json();
      if (!data.results || data.results.length === 0) break;

      allMovies = allMovies.concat(data.results);

      const pageMax = Math.max(...data.results.map((m) => m.vote_average));
      if (pageMax > maxAvailableRating) maxAvailableRating = pageMax;

      if (allMovies.length >= MOVIES_PER_PAGE * MAX_PAGES) break;
    }

    const effectiveRating =
      requestedRating > maxAvailableRating
        ? maxAvailableRating
        : requestedRating;

    const filtered = allMovies.filter(
      (m) => m.vote_average >= effectiveRating && m.adult !== true
    );

    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    return NextResponse.json({
      results: filtered,
      maxAvailableRating,
      effectiveRating,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
