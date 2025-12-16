"use client";

import { useRouter } from "next/navigation";

export default function MoviesPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Film</h1>
      <p className="mb-4">Questa pagina non è attualmente in uso.</p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Vai alla Home
      </button>
    </main>
  );
}
