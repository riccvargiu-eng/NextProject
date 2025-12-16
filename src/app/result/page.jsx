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

    if (shuffledIds.length === 0) {
      setShuffledIds(shuffleArray(savedIds));
      setShownIds([]);
    }

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
        <h1 className="text-2xl font-bold mb-4">Nessun film selezionato</h1>
        <button
          onClick={() => router.push("/setup")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Torna indietro
        </button>
      </main>
    );
  }

  if (loading || !selectedMovie) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-lg">Caricamento film...</p>
      </main>
    );
  }

  const genreNames = selectedMovie.genres?.map((g) => g.name).join(", ");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        {selectedMovie.title}
      </h1>

      {selectedMovie.poster_path && (
        <div className="w-48 h-72 sm:w-64 sm:h-[384px] relative mb-4">
          <Image
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
            fill
            className="rounded-lg shadow object-cover"
            priority
          />
        </div>
      )}

      <p className="mb-2 text-sm sm:text-base text-center max-w-2xl">
        <strong>Trama:</strong> {selectedMovie.overview}
      </p>
      <p className="mb-2 text-sm sm:text-base">
        <strong>Data di uscita:</strong> {selectedMovie.release_date}
      </p>
      <p className="mb-2 text-sm sm:text-base">
        <strong>Generi:</strong> {genreNames || "N/A"}
      </p>
      <p className="mb-4 text-sm sm:text-base">
        <strong>Voto:</strong> {selectedMovie.vote_average ?? "N/A"}
      </p>

      {cast.length > 0 && (
        <div className="w-full mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
            Cast
          </h3>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {cast.map((actor) => (
              <div key={actor.id} className="text-center">
                {actor.profile_path && (
                  <div className="relative w-20 h-28 sm:w-24 sm:h-32 mb-2">
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      className="rounded object-cover"
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

      <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 justify-center">
        <button
          onClick={pickRandomMovie}
          className="bg-green-600 text-white px-4 sm:px-5 py-2 rounded text-sm sm:text-base hover:bg-green-700 transition"
        >
          Scegli un altro
        </button>
        <button
          onClick={() => router.push("/list")}
          className="bg-gray-400 text-white px-4 sm:px-5 py-2 rounded text-sm sm:text-base hover:bg-gray-500 transition"
        >
          Torna alla lista
        </button>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("savedMovies");
          localStorage.removeItem("targetMovies");
          router.push("/");
        }}
        className="bg-purple-600 text-white px-5 sm:px-6 py-2 rounded text-sm sm:text-base hover:bg-purple-700 transition"
      >
        Ricomincia
      </button>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center min-h-screen p-6">
          <p className="text-lg">Caricamento...</p>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
