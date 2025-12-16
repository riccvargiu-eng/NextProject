"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function DetailsPage({ params: paramsPromise }) {
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
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

  useEffect(() => {
    if (!movieId) return;
    async function fetchCastAndVideos() {
      try {
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${
            process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
          }`
        );
        if (creditsRes.ok) {
          const creditsData = await creditsRes.json();
          setCast(creditsData.cast || []);
        }

        const videosRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${
            process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
          }`
        );
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          const trailer = videosData.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
      } catch (err) {
        console.error("Error fetching cast/videos:", err);
      }
    }
    fetchCastAndVideos();
  }, [movieId]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen p-6">
        <p className="text-lg">Loading movie details...</p>
      </main>
    );
  }

  if (!movie) {
    notFound();
  }

  const genreNames = movie.genres?.map((g) => g.name).join(", ");

  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-400 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {movie.poster_path && (
          <div className="w-48 h-72 sm:w-64 sm:h-96 relative flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="rounded-lg shadow object-cover"
              priority
            />
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            {movie.title}
          </h1>
          <p className="mb-2 text-sm sm:text-base">
            <strong>Overview:</strong> {movie.overview}
          </p>
          <p className="mb-2 text-sm sm:text-base">
            <strong>Release date:</strong> {movie.release_date}
          </p>
          <p className="mb-2 text-sm sm:text-base">
            <strong>Genres:</strong> {genreNames || "N/A"}
          </p>
          <p className="mb-2 text-sm sm:text-base">
            <strong>Rating:</strong> {movie.vote_average ?? "N/A"}
          </p>
        </div>
      </div>

      {cast.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Cast
          </h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {cast.slice(0, 12).map((actor) => (
              <div
                key={actor.id}
                className="w-24 sm:w-32 text-center flex flex-col items-center"
              >
                {actor.profile_path && (
                  <div className="relative w-24 h-36 sm:w-32 sm:h-48 mb-2">
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      className="rounded-lg shadow object-cover"
                    />
                  </div>
                )}
                <p className="font-semibold text-xs sm:text-sm">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {trailerKey && (
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Trailer
          </h2>
          <div className="flex justify-center px-4">
            <iframe
              className="w-full max-w-2xl aspect-video rounded-lg shadow"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
}
