"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(""); // genere scelto
  const [selectedRating, setSelectedRating] = useState(0); // rating minimo
  const [totalMovies, setTotalMovies] = useState(5); // numero film da salvare
  const [loading, setLoading] = useState(false);

  // Carichiamo i generi tramite API route server-side
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch("/api/genres");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch genres");
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    }
    fetchGenres();
  }, []);

  const handleStart = () => {
    if (!selectedGenre) return alert("Please select a genre!");
    setLoading(true);
    // Salva il target di film desiderato e i parametri di ricerca in localStorage
    localStorage.setItem("targetMovies", totalMovies.toString());
    localStorage.setItem(
      "searchParams",
      JSON.stringify({
        genre: selectedGenre,
        rating: selectedRating,
        total: totalMovies,
      })
    );
    router.push(
      `/browse?genre=${selectedGenre}&rating=${selectedRating}&total=${totalMovies}` // reindirizza alla pagina di navigazione con i parametri selezionati
    );
  };

  return (
    <main className="p-4 sm:p-6 max-w-md mx-auto min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-16 text-center">
        Setup Filters
      </h1>

      {/* Numero di film da salvare */}
      <div className="mb-8 sm:mb-10">
        <label className="block text-center mb-2 sm:mb-3 text-base sm:text-lg">
          Create your list!
        </label>
        <div className="flex justify-center">
          <select
            value={totalMovies}
            onChange={(e) => setTotalMovies(Number(e.target.value))}
            className="border p-2 text-sm sm:text-base rounded"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "movie" : "movies"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selezione del genere */}
      <label className="block mb-10 sm:mb-16 text-center text-base sm:text-lg">
        Genre:
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border p-2 ml-2 w-full text-sm sm:text-base rounded mt-2"
        >
          <option value="">-- Choose genre --</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </label>

      {/* Slider rating */}
      <label className="block mb-8 sm:mb-10 text-center text-base sm:text-lg">
        Minimum rating: {selectedRating.toFixed(1)}
        <input
          type="range"
          min="0"
          max="7"
          step="0.1"
          value={selectedRating}
          onChange={(e) => setSelectedRating(Number(e.target.value))}
          className="w-full mt-2"
        />
      </label>

      {/* Pulsante start */}
      <div className="flex justify-center">
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded text-base sm:text-lg hover:bg-blue-700 transition"
        >
          Start
        </button>
      </div>

      {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
    </main>
  );
}
