import { getPopularMovies } from "../../lib/tmdb";

export default async function MoviesPage() {
  const data = await getPopularMovies();

  return (
    <main>
      <h1>Film Popolari</h1>
      <div>
        {data.results.slice(0, 10).map((movie) => (
          <article key={movie.id}>
            <h3>{movie.title}</h3>
          </article>
        ))}
      </div>
    </main>
  );
}
