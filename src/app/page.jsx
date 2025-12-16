// import Link from 'next/link'

// export default function Home() {
//   return (
//     <main>
//       <h1>Server Rendering & Server Actions Demo</h1>
//       <nav>
//         <div>
//           <Link href="/posts">Posts (JSONPlaceholder)</Link>
//         </div>
//         <div>
//           <Link href="/movies">Film (TMDB API)</Link>
//         </div>
//       </nav>
//     </main>
//   )
// }

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen pt-64 p-6 bg-zinc-50 dark:bg-black">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Film Picker
      </h1>

      <p className="mb-6 text-center text-gray-700 dark:text-gray-300 max-w-md">
        Unsure what movie to watch? <br /> Use Film Picker to select your
        favorite movies from a list and get a random recommendation!
      </p>

      <Link
        href="/setup"
        className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition"
      >
        Start Film Picker
      </Link>
    </main>
  );
}
