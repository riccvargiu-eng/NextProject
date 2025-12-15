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
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Setup Filters</h1>

      {/* Numero di film da salvare */}
      <label className="block mb-2">
        Create your list!
        <select
          value={totalMovies}
          onChange={(e) => setTotalMovies(Number(e.target.value))}
          className="border p-1 ml-2"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "movie" : "movies"}
            </option>
          ))}
        </select>
      </label>

      {/* Selezione del genere */}
      <label className="block mb-4">
        Genre:
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border p-1 ml-2 w-full"
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
      <label className="block mb-4">
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
      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start
      </button>

      {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
    </main>
  );
}
