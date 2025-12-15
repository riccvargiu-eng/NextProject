"use client";

import { useRouter } from "next/navigation";

export default function MoviesPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Movies</h1>
      <p className="mb-4">This page is not currently in use.</p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go to Home
      </button>
    </main>
  );
}
