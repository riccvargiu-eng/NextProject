"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const genre = searchParams.get("genre");
  const rating = Number(searchParams.get("rating")) || 0;
  const totalMovies = Number(searchParams.get("total")) || 5;

  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica film salvati da localStorage all'avvio
  useEffect(() => {
    const stored = localStorage.getItem("savedMovies");
    if (stored) {
      setSavedMovies(JSON.parse(stored));
    }
  }, []);

  // Carica film dall'API
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
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [genre, rating]);

  // Salva film in localStorage
  const saveMovie = (movie) => {
    // Controlla se il film è già stato salvato per evitare duplicati
    if (savedMovies.find((m) => m.id === movie.id)) {
      alert("Movie already saved!");
      nextMovie();
      return;
    }
    const newSaved = [...savedMovies, movie];
    setSavedMovies(newSaved);
    localStorage.setItem("savedMovies", JSON.stringify(newSaved));
    nextMovie();
  };

  const nextMovie = () => {
    if (currentIndex + 1 < movies.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Se finiti i film, ricomincia o mostra messaggio
      setCurrentIndex(0);
    }
  };

  if (!genre) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
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
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-lg">Loading movies...</p>
      </main>
    );
  }

  const movie = movies[currentIndex];
  const progress = savedMovies.length;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Movies</h1>

      <div className="w-64 h-[384px] relative mb-4">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="rounded-lg shadow object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
      <p className="mb-2">
        <strong>Overview:</strong> {movie.overview}
      </p>
      <p className="mb-2">
        <strong>Release:</strong> {movie.release_date}
      </p>
      <p className="mb-2">
        <strong>Rating:</strong> {movie.vote_average}
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={nextMovie}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Skip
        </button>
        <button
          onClick={() => saveMovie(movie)}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={progress >= totalMovies}
        >
          Save
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Saved {progress} of {totalMovies} movies
      </p>

      {progress >= totalMovies && (
        <button
          onClick={() => router.push("/list")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to List
        </button>
      )}
    </main>
  );
}
