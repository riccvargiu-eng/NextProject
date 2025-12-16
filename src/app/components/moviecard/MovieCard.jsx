"use client";

import Image from "next/image";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie }) {
  if (!movie) return null;

  return (
    <div className={styles.card}>
      <div className={styles.contentRow}>
        {/* POSTER - fixed width 200px */}
        {movie.poster_path && (
          <div className={styles.posterWrapper}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className={styles.poster}
              sizes="(max-width: 768px) 120px, 200px"
              priority
            />
          </div>
        )}

        {/* TRAILER - flex-grow */}
        <div className={styles.trailerWrapper}>
          <div className={styles.trailerPlaceholder}>
            <span className={styles.trailerText}>Trailer Placeholder</span>
          </div>
        </div>

        {/* INFO - fixed width 300px */}
        <div className={styles.info}>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.overview}>
            {movie.overview || "No description available."}
          </p>
          <div className={styles.rating}>
            <span className={styles.ratingIcon}>⭐</span>
            <span className={styles.ratingValue}>
              {movie.vote_average?.toFixed(1) ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
