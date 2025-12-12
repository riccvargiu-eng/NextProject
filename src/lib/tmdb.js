// export async function getPopularMovies() {
//   const res = await fetch(
//     `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=it-IT`,
//     { next: { revalidate: 60 } }
//   );
//   return res.json();
// }

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function getMoviesByGenre(genreId) {
  const res = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&language=it-IT`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) throw new Error("Failed to fetch movies by genre");

  return res.json();
}

export async function getMovieGenres() {
  const res = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=it-IT`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) throw new Error("Failed to fetch movie genres");

  return res.json();
}
