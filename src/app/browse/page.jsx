// "use client";

// import { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// import { getMovieGenres } from "@/lib/tmdb";
// import { useSearchParams } from "next/navigation";

// export default function BrowsePage() {
//   const [movies, setMovies] = useState([]); // Tutti i film recuperati
//   const [currentIndex, setCurrentIndex] = useState(0); // Indice del film corrente
//   const [savedMovies, setSavedMovies] = useState([]); // Film salvati dall’utente

//   useEffect(() => {
//     async function fetchData() {
//       const data = await getMoviesByGenre(27);
//       setMovies(data.results);
//     }
//     fetchData();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Browse Movies</h1>
//       {/* da completare */}
//       <p>Caricamento film...</p>
//     </div>
//   );
// }
