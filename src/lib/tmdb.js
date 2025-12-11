export async function getPopularMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=it-IT`,
    { next: { revalidate: 60 } }
  );
  return res.json();
}
