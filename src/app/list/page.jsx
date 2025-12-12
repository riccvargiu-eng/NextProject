"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ListPage() {
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState([]);

  // 1️⃣ Carica i film salvati da localStorage
  useEffect(() => {
    const stored = localStorage.getItem("savedMovies");
    if (stored) {
      setSavedMovies(JSON.parse(stored));
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

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saved Movies</h1>

      {savedMovies.length === 0 && <p>No movies saved yet.</p>}

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
        <button
          onClick={handleFinish}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
        >
          Continue to Final Result
        </button>
      )}
    </main>
  );
}
