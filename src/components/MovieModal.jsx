import { useEffect } from "react";
import { IMAGE_BASE_URL } from "../config";

function MovieModal({ movie, onClose }) {
  //Extract data safely with fallbacks
  const year = movie.release_date?.split("-")[0] || "N/A";
  const rating = movie.vote_average?.toFixed(1) || "N/A";
  const overview = movie.overview || "No overview available";
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  // Close modal when user presses Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent page scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    // Clicking the dark overlay closes the modal
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation stops click from reaching the overlay */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {backdrop ? (
          <img className="modal-backdrop" src={backdrop} alt={movie.title} />
        ) : (
          <div className="modal-backdrop-placeholder">🎬</div>
        )}

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-body">
          <h2 className="modal-title">{movie.title}</h2>

          <div className="modal-meta">
            <span className="modal-year">📅 {year}</span>
            <span className="modal-rating"> ⭐ {rating}</span>
            <span className="modal-votes">
              🗳️ {movie.vote_count?.toLocaleString()} votes
            </span>
          </div>

          <p className="modal-overview">{overview}</p>

          {/* Popularity score */}
          <div className="modal-popularity">
            <span>🔥 Popularity Score: </span>
            <strong>{movie.popularity?.toFixed(0)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
