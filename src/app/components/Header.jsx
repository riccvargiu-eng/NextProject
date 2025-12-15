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

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={handleHomeClick}
          className="text-xl font-bold hover:text-gray-300 cursor-pointer"
        >
          Movie Picker
        </button>
        <button
          onClick={handleHomeClick}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
        >
          Home
        </button>
      </div>
    </header>
  );
}
