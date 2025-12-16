import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen pt-32 sm:pt-48 md:pt-64 p-4 sm:p-6 bg-black dark:bg-black">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white dark:text-white text-center">
        Film Picker
      </h1>

      <p className="mb-6 sm:mb-8 text-center text-base sm:text-lg text-gray-300 dark:text-gray-300 max-w-md px-4">
        Non sai che film guardare? <br /> Usa Film Picker per selezionare i tuoi
        film preferiti da una lista e ottenere un consiglio casuale!
      </p>

      <Link
        href="/setup"
        className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded text-base sm:text-lg hover:bg-blue-700 transition"
      >
        Avvia Film Picker
      </Link>
    </main>
  );
}
