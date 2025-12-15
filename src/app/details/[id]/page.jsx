"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DetailsPage({ params: paramsPromise }) {
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieId, setMovieId] = useState(null);

  useEffect(() => {
    async function unwrapParams() {
      const params = await paramsPromise;
      setMovieId(params.id);
    }
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (!movieId) return;
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen p-6">
        <p className="text-lg">Loading movie details...</p>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </main>
    );
  }

  const genreNames = movie.genres?.map((g) => g.name).join(", ");

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-400 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {movie.poster_path && (
          <div className="w-64 h-96 relative flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="rounded-lg shadow object-cover"
              priority
            />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="mb-2">
            <strong>Overview:</strong> {movie.overview}
          </p>
          <p className="mb-2">
            <strong>Release date:</strong> {movie.release_date}
          </p>
          <p className="mb-2">
            <strong>Genres:</strong> {genreNames || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Rating:</strong> {movie.vote_average ?? "N/A"}
          </p>
        </div>
      </div>
    </main>
  );
}
