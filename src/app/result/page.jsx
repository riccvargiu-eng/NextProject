"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shownIds, setShownIds] = useState([]);
  const [shuffledIds, setShuffledIds] = useState([]);

  // Recupera ids dai query params o fallback a localStorage
  const getSavedIds = () => {
    const idsString = searchParams.get("ids");
    if (idsString) return idsString.split(",");
    const saved = localStorage.getItem("savedMovies");
    if (saved) return JSON.parse(saved).map((m) => String(m.id));
    return [];
  };

  const savedIds = getSavedIds();

  const pickRandomMovie = async () => {
    if (savedIds.length === 0) return;

    setLoading(true);

    // Inizializza shuffledIds se vuoto
    if (shuffledIds.length === 0) {
      setShuffledIds(shuffleArray(savedIds));
      setShownIds([]);
    }

    // Prendi il primo ID non ancora mostrato
    let availableIds = shuffledIds.filter((id) => !shownIds.includes(id));
    let nextId;

    if (availableIds.length === 0) {
      const newShuffled = shuffleArray(savedIds);
      setShuffledIds(newShuffled);
      setShownIds([]);
      nextId = newShuffled[0];
    } else {
      nextId = availableIds[0];
    }

    try {
      const res = await fetch(`/api/movies/${nextId}`);
      if (!res.ok) throw new Error("Failed to fetch movie details");
      const movie = await res.json();
      setSelectedMovie(movie);
      setShownIds((prev) => [...prev, nextId]);
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pickRandomMovie();
  }, []);

  if (savedIds.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">No movies selected</h1>
        <button
          onClick={() => router.push("/setup")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </main>
    );
  }

  if (loading || !selectedMovie) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-lg">Loading movie...</p>
      </main>
    );
  }

  const genreNames = selectedMovie.genres?.map((g) => g.name).join(", ");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">{selectedMovie.title}</h1>

      {selectedMovie.poster_path && (
        <div className="w-64 h-[384px] relative mb-4">
          <Image
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
            fill
            className="rounded-lg shadow object-cover"
            priority
          />
        </div>
      )}

      <p className="mb-2">
        <strong>Overview:</strong> {selectedMovie.overview}
      </p>
      <p className="mb-2">
        <strong>Release date:</strong> {selectedMovie.release_date}
      </p>
      <p className="mb-2">
        <strong>Genres:</strong> {genreNames || "N/A"}
      </p>
      <p className="mb-4">
        <strong>Rating:</strong> {selectedMovie.vote_average ?? "N/A"}
      </p>

      <div className="flex gap-4 mb-4">
        <button
          onClick={pickRandomMovie}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Pick Again
        </button>
        <button
          onClick={() => router.push("/list")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Back to List
        </button>
      </div>

      <button
        onClick={() => router.push("/")}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        Try Again
      </button>
    </main>
  );
}
