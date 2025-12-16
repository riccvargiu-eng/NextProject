"use client";

import { useState, useEffect, Suspense } from "react";
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

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cast, setCast] = useState([]);
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

      // Fetch cast
      const castRes = await fetch(
        `https://api.themoviedb.org/3/movie/${nextId}/credits?api_key=${
          process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
        }`
      );
      if (castRes.ok) {
        const castData = await castRes.json();
        setCast(castData.cast?.slice(0, 8) || []);
      }

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

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="w-full mb-6">
          <h3 className="text-xl font-bold mb-4 text-center">Cast</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {cast.map((actor) => (
              <div key={actor.id} className="text-center">
                {actor.profile_path && (
                  <div className="relative w-24 h-32 mb-2">
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                )}
                <p className="font-semibold text-sm">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
        onClick={() => {
          localStorage.removeItem("savedMovies");
          localStorage.removeItem("targetMovies");
          router.push("/");
        }}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        Try Again
      </button>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center min-h-screen p-6">
          <p className="text-lg">Loading...</p>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
