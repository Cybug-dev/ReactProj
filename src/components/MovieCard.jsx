import { useState } from "react";
import { IMAGE_BASE_URL } from "../config";

function MovieCard({ movie, onMovieClick }) {
  const [liked, setLiked] = useState(false);

  // Extract the year from the full date "2023-05-12" → "2023"
  const year = movie.release_date?.split("-")[0] || "N/A";

  //Round rating to 1 decimal place
  const rating = movie.vote_average?.toFixed(1) || "N/A";

  function handleLikeClick(e) {
    e.stopPropagation(); // Don't open modal when clicking like button!
    setLiked(!liked);
  }

  return (
    // Clicking the card triggers onMovieClick
    <div className="movie-card" onClick={() => onMovieClick(movie)}>
      <button className="like-btn" onClick={handleLikeClick}>
        {liked ? "❤️" : "🤍"}
      </button>

      {/* Show poster if available, otherwise show emoji placeholder */}

      {movie.poster_path ? (
        <img
          className="movie-poster"
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
        />
      ) : (
        <div className="no-poster">🎬</div>
      )}

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{year}</span>
          <span className="movie-rating">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
