"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleHomeClick = () => {
    // Svuota il localStorage e vai alla home
    localStorage.removeItem("savedMovies");
    localStorage.removeItem("targetMovies");
    router.push("/");
  };

  const handleReset = () => {
    // Recupera i parametri di ricerca salvati
    const savedParams = localStorage.getItem("searchParams");
    if (savedParams) {
      const params = JSON.parse(savedParams);
      // Svuota solo la lista salvata, mantieni i parametri
      localStorage.removeItem("savedMovies");
      // Se sei già sulla pagina browse, ricarica per aggiornare lo stato
      if (window.location.pathname === "/browse") {
        window.location.reload();
      } else {
        router.push(
          `/browse?genre=${params.genre}&rating=${params.rating}&total=${params.total}`
        );
      }
    } else {
      // Se non ci sono parametri salvati, vai al setup
      localStorage.removeItem("savedMovies");
      localStorage.removeItem("targetMovies");
      router.push("/setup");
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={handleHomeClick}
          className="text-xl font-bold hover:text-gray-300 cursor-pointer"
        >
          Film Picker
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded transition"
          >
            Reset
          </button>
          <button
            onClick={handleHomeClick}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
          >
            Home
          </button>
        </div>
      </div>
    </header>
  );
}
