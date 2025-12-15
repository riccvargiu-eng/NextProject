"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <main className="p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Saved Movies</h1>
        <button
          onClick={handleReset}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition"
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

      <ul className="space-y-4">
        {savedMovies.map((movie) => (
          <li key={movie.id} className="border p-4 rounded shadow">
            {/* Titolo cliccabile per aprire i dettagli */}
            <h3 className="text-lg font-semibold">
              <Link
                href={`/details/${movie.id}`}
                className="text-blue-600 underline"
              >
                {movie.title}
              </Link>
            </h3>

            <p className="text-sm text-gray-600">{movie.overview}</p>

            <button
              onClick={() => handleRemove(movie.id)}
              className="bg-red-600 mt-2 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {savedMovies.length > 0 && (
        <div className="flex gap-4 mt-6">
          {savedMovies.length < targetMovies && (
            <button
              onClick={() => router.push("/setup")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Add More Movies ({savedMovies.length}/{targetMovies})
            </button>
          )}
          <button
            onClick={handleFinish}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Continue to Final Result
          </button>
        </div>
      )}
    </main>
  );
}
