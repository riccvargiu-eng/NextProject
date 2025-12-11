"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMovieGenres } from "@/lib/tmdb";

export default function SetupPage() {
  const router = useRouter();

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(""); // genere scelto
  const [selectedRating, setSelectedRating] = useState(0); // rating minimo
  const [totalMovies, setTotalMovies] = useState(5); // numero film da salvare
  const [loading, setLoading] = useState(false);

  // Carichiamo i generi da TMDB
  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await getMovieGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    }
    fetchGenres();
  }, []);

  const handleStart = () => {
    setLoading(true);
    router.push(
      `/browse?genre=${selectedGenre}&rating=${selectedRating}&total=${totalMovies}` // reindirizza alla pagina di navigazione con i parametri selezionati
    );
  };

  return (
    <main className="p-6 max-w-md mx-auto"> {/* Contenitore centrale */}
      <h1 className="text-2xl font-bold mb-4">Setup Filters: </h1> {/* Titolo della pagina */}

      <label className="block mb-2">    {/* Numero di film da salvare */}
        Create your list!
        <input
          type="number"
          min="1"
          max="20"
          value={totalMovies}
          onChange={(e) => setTotalMovies(Number(e.target.value))}
          className="border p-1 ml-2 w-16"  {/* Input per il numero di film */}
        />
      </label>

      <label className="block mb-2">   {/* Selezione del genere */}
        Genre:
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border p-1 ml-2"   {/* Dropdown per la selezione del genere */}
        >
          <option value="">-- Choose genre --</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}> {/* Opzioni dei generi */}
              {g.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        Minimum rating:
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={selectedRating}
          onChange={(e) => setSelectedRating(Number(e.target.value))}
          className="border p-1 ml-2 w-16"  {/* Input per il rating minimo */}
        />
      </label>

      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-4 py-2 rounded" /* Pulsante di avvio */
      >
        Start
      </button>

      {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
    </main>
  );
}
