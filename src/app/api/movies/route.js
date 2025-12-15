import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const MOVIES_PER_PAGE = 20; // max per pagina
const MAX_PAGES = 25; // per arrivare fino a 500 film

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const requestedRating = Number(searchParams.get("rating")) || 0;

    if (!genre) {
      return NextResponse.json({ results: [], maxAvailableRating: 0 });
    }

    let allMovies = [];
    let maxAvailableRating = 0;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genre}&language=it-IT&vote_count.gte=10&page=${page}`
      );

      if (!res.ok) break; // se errore stop

      const data = await res.json();
      if (!data.results || data.results.length === 0) break;

      allMovies = allMovies.concat(data.results);

      // Aggiorna il massimo rating disponibile
      const pageMax = Math.max(...data.results.map((m) => m.vote_average));
      if (pageMax > maxAvailableRating) maxAvailableRating = pageMax;

      // Stop se abbiamo già 500 film
      if (allMovies.length >= MOVIES_PER_PAGE * MAX_PAGES) break;
    }

    // Soft filter: se il rating richiesto è troppo alto, usa il massimo disponibile
    const effectiveRating =
      requestedRating > maxAvailableRating
        ? maxAvailableRating
        : requestedRating;

    const filtered = allMovies.filter((m) => m.vote_average >= effectiveRating);

    // Randomizza l'ordine dei film usando Fisher-Yates shuffle
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
