"use server";
import { getMovieDetails } from "@/lib/movies";

export default async function DetailsPage({ params }) {
  const movieID = params.id;

  const movie = await getMovieDetails(movieID);

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  const genreNames = movie.genres?.map(g => g.name).join(", ");

  return (
    <main>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p>{movie.release_date}</p>
      <p>{genreNames}</p>
    </main>
  );
}
