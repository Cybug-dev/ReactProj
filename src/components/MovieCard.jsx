import { IMAGE_BASE_URL } from "../config";

function MovieCard({
  movie,
  onMovieClick,
  toggleFavourite,
  isFavourited,
  highlight,
  onOpenModal,
}) {
  const year = movie.release_date?.split("-")[0] || "N/A";
  const rating = movie.vote_average?.toFixed(1) || "N/A";
  const favourited = isFavourited(movie.id);

  function openDetails() {
    onMovieClick?.(movie);
  }

  function handleLikeClick(event) {
    event.stopPropagation();
    toggleFavourite(movie.id);
  }

  function handlePlayClick(event) {
    event.stopPropagation();
    (onOpenModal ?? onMovieClick)?.(movie);
  }

  function handleInfoClick(event) {
    event.stopPropagation();
    openDetails();
  }

  return (
    <div className="movie-card" onClick={openDetails}>
      <div className="poster-wrapper">
        {movie.poster_path ? (
          <img
            className="movie-poster"
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="no-poster">
            <i className="fa-solid fa-film" aria-hidden="true" />
          </div>
        )}

        <div className="overlay">
          <div className="control-row">
            <button
              className="play-btn"
              type="button"
              onClick={handlePlayClick}
              title="Play trailer"
            >
              <i className="fa-solid fa-play" aria-hidden="true" />
            </button>
            <button
              className="add-btn"
              type="button"
              onClick={handleLikeClick}
              title={
                favourited ? "Remove from favourites" : "Add to favourites"
              }
            >
              <i className="fa-solid fa-plus" aria-hidden="true" />
            </button>
            <button
              className="info-btn"
              type="button"
              onClick={handleInfoClick}
              title="More info"
            >
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <button
        className="like-btn"
        type="button"
        onClick={handleLikeClick}
        title={favourited ? "Remove from favourites" : "Add to favourites"}
      >
        <i
          className={favourited ? "fa-solid fa-heart" : "fa-regular fa-heart"}
          aria-hidden="true"
        />
      </button>

      <div className="movie-info">
        <div>
          <h3 className="movie-title">{movie.title}</h3>
        </div>
        <div className="movie-meta">
          <span className="movie-year">{year}</span>
          <span className="movie-rating">
            <i className="fa-solid fa-star" aria-hidden="true" /> {rating}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
