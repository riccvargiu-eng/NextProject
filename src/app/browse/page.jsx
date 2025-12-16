"use client";

import MovieCard from "@/app/components/moviecard/MovieCard";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const genre = searchParams.get("genre");
  const rating = Number(searchParams.get("rating")) || 0;
  const totalMovies = Number(searchParams.get("total")) || 5;

  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);

  const movie = movies[currentIndex] || null;
  const progress = savedMovies.length;

  useEffect(() => {
    const stored = localStorage.getItem("savedMovies");
    setSavedMovies(stored ? JSON.parse(stored) : []);
  }, [genre, rating, totalMovies]);

  useEffect(() => {
    async function fetchMovies() {
      if (!genre) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/movies?genre=${genre}&rating=${rating}`);
        const data = await res.json();
        if (!res.ok || !data.results)
          throw new Error(data.error || "Failed to fetch movies");
        setMovies(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [genre, rating]);

  useEffect(() => {
    async function fetchTrailerAndCast() {
      if (!movie?.id) return;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${
            process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
          }`
        );
        const data = await res.json();
        const trailer = data.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);

        const castRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${
            process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
          }`
        );
        const castData = await castRes.json();
        setCast(castData.cast?.slice(0, 5) || []);
      } catch (err) {
        console.error("Error fetching trailer/cast:", err);
        setTrailerKey(null);
        setCast([]);
      }
    }
    fetchTrailerAndCast();
  }, [movie?.id]);

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1 < movies.length ? prev + 1 : 0));
  };

  const saveMovie = (movie) => {
    if (savedMovies.some((m) => m.id === movie.id)) {
      nextMovie();
      return;
    }
    const updated = [...savedMovies, movie];
    setSavedMovies(updated);
    localStorage.setItem("savedMovies", JSON.stringify(updated));
    nextMovie();
  };

  if (!genre) {
    return (
      <main className="flex flex-col items-center justify-center h-screen w-full">
        <h1 className="text-2xl font-bold mb-4">Nessun genere selezionato</h1>
        <button
          onClick={() => router.push("/setup")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Torna indietro
        </button>
      </main>
    );
  }

  if (loading || movies.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <p className="text-lg">Caricamento film...</p>
      </main>
    );
  }

  return (
    <main
      className="flex flex-col items-center justify-center w-full"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div className="flex flex-col items-center justify-center flex-grow w-full px-2 sm:px-4 gap-3 sm:gap-4">
        <MovieCard movie={movie} trailerKey={trailerKey} cast={cast} />

        <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
          <button
            onClick={() => {
              localStorage.removeItem("savedMovies");
              setSavedMovies([]);
              setCurrentIndex(0);
            }}
            className="bg-orange-600 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base hover:bg-orange-700 transition"
          >
            Resetta
          </button>

          <button
            onClick={nextMovie}
            className="bg-gray-400 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base hover:bg-gray-500 transition"
          >
            Skip
          </button>

          {progress < totalMovies && (
            <button
              onClick={() => saveMovie(movie)}
              className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base hover:bg-green-700 transition"
            >
              Salva
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Salvati {progress} di {totalMovies}
        </p>

        {progress >= totalMovies && (
          <button
            onClick={() => router.push("/list")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Vai alla lista
          </button>
        )}
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center h-screen w-full">
          <p className="text-lg">Caricamento...</p>
        </main>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
