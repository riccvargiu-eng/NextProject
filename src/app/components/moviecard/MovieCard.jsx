"use client";

import Image from "next/image";
import { useState, useLayoutEffect } from "react";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie, trailerKey, cast }) {
  const [isMobile, setIsMobile] = useState(true); // Default a true per evitare hydration mismatch

  useLayoutEffect(() => {
    // Controlla la dimensione dello schermo immediatamente
    setIsMobile(window.innerWidth < 640);
  }, []);

  if (!movie) return null;

  return (
    <div className={styles.card}>
      {/* Riga principale: poster, trailer, info */}
      <div className={styles.contentRow}>
        {/* POSTER - NON renderizzato su mobile */}
        {!isMobile && movie.poster_path && (
          <div className={styles.posterWrapper}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className={styles.poster}
              sizes="(max-width: 1440px) 200px, 280px"
            />
          </div>
        )}

        {/* TRAILER */}
        <div className={styles.trailerWrapper}>
          {trailerKey ? (
            <iframe
              className={styles.trailerIframe}
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className={styles.trailerPlaceholder}>
              No Trailer Available
            </div>
          )}
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
          {cast && cast.length > 0 && (
            <div className={styles.castPreview}>
              <p className={styles.castLabel}>Cast:</p>
              <p className={styles.castNames}>
                {cast
                  .slice(0, 3)
                  .map((a) => a.name)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
