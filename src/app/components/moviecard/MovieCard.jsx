"use client";

import Image from "next/image";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie, onPrimaryAction, actionLabel }) {
  if (!movie) return null;

  return (
    <div className={styles.card}>
      {/* Riga principale: poster, trailer, info */}
      <div className={styles.contentRow}>
        {/* POSTER */}
        {movie.poster_path && (
          <div className={styles.posterWrapper}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className={styles.poster}
              sizes="200px"
            />
          </div>
        )}

        {/* TRAILER */}
        <div className={styles.trailerWrapper}>
          {/* Placeholder per iframe YouTube */}
          <div className={styles.trailerPlaceholder}>Trailer</div>
        </div>

        {/* INFO */}
        <div className={styles.info}>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.overview}>
            {movie.overview || "No description available."}
          </p>
          <p className={styles.rating}>
            ⭐ {movie.vote_average?.toFixed(1) ?? "N/A"}
          </p>
        </div>
      </div>

      {/* AZIONI */}
      {onPrimaryAction && (
        <div className={styles.actions}>
          <button onClick={onPrimaryAction}>{actionLabel || "Action"}</button>
        </div>
      )}
    </div>
  );
}
