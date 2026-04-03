import { useEffect, useState } from "react";
import { API_KEY, BASE_URL } from "../config";

function MovieModal({ movie, onClose }) {
  const year = movie.release_date?.split("-")[0] || "N/A";
  const rating = movie.vote_average?.toFixed(1) || "N/A";
  const overview = movie.overview || "No overview available";
  const votes =
    typeof movie.vote_count === "number"
      ? movie.vote_count.toLocaleString()
      : "N/A";
  const [trailerKey, setTrailerKey] = useState(null);
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const controller = new AbortController();
    setTrailerKey(null);

    async function fetchTrailer() {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch trailer");
        }

        const data = await response.json();
        const trailer =
          data.results?.find(
            (video) => video.type === "Trailer" && video.site === "YouTube",
          ) ?? data.results?.find((video) => video.site === "YouTube");

        setTrailerKey(trailer?.key ?? null);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching trailer:", error);
          setTrailerKey(null);
        }
      }
    }

    fetchTrailer();
    return () => controller.abort();
  }, [movie.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    // Clicking the dark overlay closes the modal
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="modal-backdrop-container">
          {backdrop ? (
            <img className="modal-backdrop" src={backdrop} alt={movie.title} />
          ) : (
            <div className="modal-backdrop-placeholder">
              <i className="fa-solid fa-film" aria-hidden="true" />
            </div>
          )}

          {trailerKey && (
            <button
              className="play-icon-btn"
              type="button"
              onClick={() => {
                const iframe = document.querySelector(".trailer-iframe");
                if (iframe) {
                  iframe.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              title="Jump to trailer"
            >
              <i className="fa-solid fa-circle-play" aria-hidden="true" />
            </button>
          )}
        </div>

        {trailerKey && (
          <iframe
            className="trailer-iframe"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}

        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
        >
          x
        </button>

        <div className="modal-body">
          <h2 className="modal-title">{movie.title}</h2>

          <div className="modal-meta">
            <span className="modal-year">
              <i className="fa-regular fa-calendar" aria-hidden="true" />
              {year}
            </span>
            <span className="modal-rating">
              <i className="fa-solid fa-star" aria-hidden="true" />
              {rating}
            </span>
            <span className="modal-votes">
              <i className="fa-solid fa-users" aria-hidden="true" />
              {votes} votes
            </span>
          </div>

          <p className="modal-overview">{overview}</p>

          <div className="modal-popularity">
            <span>
              <i className="fa-solid fa-fire" aria-hidden="true" /> Popularity
              score:
            </span>
            <strong>{movie.popularity?.toFixed(0)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
