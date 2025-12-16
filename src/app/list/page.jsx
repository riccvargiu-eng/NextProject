"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ListPage() {
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState([]);
  const [targetMovies, setTargetMovies] = useState(0);

  // 1️⃣ Carica i film salvati e il target da localStorage
  useEffect(() => {
    const stored = localStorage.getItem("savedMovies");
    if (stored) {
      const movies = JSON.parse(stored);
      // Rimuovi duplicati basandosi sull'id
      const uniqueMovies = movies.filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      );
      // Se ci sono duplicati, aggiorna localStorage con la lista pulita
      if (uniqueMovies.length !== movies.length) {
        localStorage.setItem("savedMovies", JSON.stringify(uniqueMovies));
      }
      setSavedMovies(uniqueMovies);
    }
    const target = localStorage.getItem("targetMovies");
    if (target) {
      setTargetMovies(Number(target));
    }
  }, []);

  // 2️⃣ Rimuovi film dalla lista
  const handleRemove = (id) => {
    const updated = savedMovies.filter((m) => m.id !== id);
    setSavedMovies(updated);
    localStorage.setItem("savedMovies", JSON.stringify(updated));
  };

  // 3️⃣ Vai alla pagina finale con film selezionati
  const handleFinish = () => {
    if (savedMovies.length === 0) return;
    // Passiamo gli ID dei film come query params
    const idsParam = savedMovies.map((m) => m.id).join(",");
    router.push(`/result?ids=${idsParam}`);
  };

  const handleReset = () => {
    const savedParams = localStorage.getItem("searchParams");
    if (savedParams) {
      const params = JSON.parse(savedParams);
      localStorage.removeItem("savedMovies");
      router.push(
        `/browse?genre=${params.genre}&rating=${params.rating}&total=${params.total}`
      );
    } else {
      localStorage.removeItem("savedMovies");
      localStorage.removeItem("targetMovies");
      router.push("/setup");
    }
  };

  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Saved Movies</h1>
        <button
          onClick={handleReset}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm sm:text-base transition"
        >
          Reset List
        </button>
      </div>

      {savedMovies.length === 0 && (
        <div className="text-center">
          <p className="mb-4">No movies saved yet.</p>
          <button
            onClick={() => router.push("/setup")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Movies to List
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedMovies.map((movie) => (
          <div
            key={movie.id}
            className="border p-4 rounded shadow bg-gray-900 text-white flex flex-col h-full"
          >
            <div className="h-16 flex items-center mb-3">
              <h3 className="text-base sm:text-lg font-semibold">
                <Link
                  href={`/details/${movie.id}`}
                  className="text-blue-400 underline"
                >
                  {movie.title}
                </Link>
              </h3>
            </div>

            <div className="mb-3">
              {movie.poster_path && (
                <div className="relative w-full aspect-[2/3]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="rounded object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description - flexible section */}
            <div className="flex-1 mb-4">
              <p className="text-base sm:text-sm text-gray-300 line-clamp-4 h-24 overflow-hidden">
                {movie.overview}
              </p>
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-4 text-sm sm:text-xs">
                <p className="font-semibold mb-1">Cast:</p>
                <p className="text-gray-400 line-clamp-2">
                  {movie.cast
                    .slice(0, 3)
                    .map((a) => a.name)
                    .join(", ")}
                </p>
              </div>
            )}

            <button
              onClick={() => handleRemove(movie.id)}
              className="bg-red-600 text-white px-3 py-2 rounded self-start text-sm sm:text-base hover:bg-red-700 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {savedMovies.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 justify-center sm:justify-start">
          {savedMovies.length < targetMovies && (
            <button
              onClick={() => router.push("/setup")}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-green-700 transition w-full sm:w-auto"
            >
              Add More Movies ({savedMovies.length}/{targetMovies})
            </button>
          )}
          <button
            onClick={handleFinish}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-blue-700 transition w-full sm:w-auto"
            disabled={savedMovies.length === 0}
          >
            Continue to Final Result
          </button>
        </div>
      )}
    </main>
  );
}
