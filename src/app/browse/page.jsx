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

  // Carica film salvati
  useEffect(() => {
    const stored = localStorage.getItem("savedMovies");
    setSavedMovies(stored ? JSON.parse(stored) : []);
  }, [genre, rating, totalMovies]);

  // Fetch film
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
        <h1 className="text-2xl font-bold mb-4">No genre selected</h1>
        <button
          onClick={() => router.push("/setup")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </main>
    );
  }

  if (loading || movies.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen w-full">
        <p className="text-lg">Loading movies...</p>
      </main>
    );
  }

  const movie = movies[currentIndex];
  const progress = savedMovies.length;

  const handleReset = () => {
    localStorage.removeItem("savedMovies");
    setSavedMovies([]);
    setCurrentIndex(0);
  };

  return (
    <main className="flex flex-col min-h-screen w-full">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Browse Movies</h1>
        <button
          onClick={handleReset}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reset
        </button>
      </header>

      {/* CARD AREA - vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <MovieCard movie={movie} />

        {/* ACTIONS BELOW CARD */}
        <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-2xl">
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={nextMovie}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Skip
            </button>

            {progress < totalMovies && (
              <button
                onClick={() => saveMovie(movie)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Save
              </button>
            )}

            <button
              onClick={handleReset}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Reset
            </button>
          </div>

          <p className="text-sm text-gray-400 font-medium">
            Saved {progress} of {totalMovies}
          </p>

          {progress >= totalMovies && (
            <button
              onClick={() => router.push("/list")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg"
            >
              Go to List
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center h-screen w-full">
          <p className="text-lg">Loading...</p>
        </main>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
