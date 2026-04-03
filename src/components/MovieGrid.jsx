import MovieCard from "./MovieCard";

function MovieGrid({
  movies,
  loading,
  error,
  searchText,
  onMovieClick,
  toggleFavourite,
  isFavourited,
  currentPage,
  totalPages,
  onLoadMore,
  onOpenModal,
}) {
  if (loading && movies.length === 0) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="state-container">
        <i className="fa-solid fa-face-frown icon" aria-hidden="true" />
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="state-container">
        <i className="fa-solid fa-film icon" aria-hidden="true" />
        <h3>No movies found</h3>
        <p>
          {searchText
            ? `No results for "${searchText}"`
            : "Start searching for movies above!"}
        </p>
      </div>
    );
  }

  return (
    <section className="movie-section">
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={onMovieClick}
            toggleFavourite={toggleFavourite}
            highlight={movie.vote_average > 8}
            isFavourited={isFavourited}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>

      {error && <p className="movie-grid-error">{error}</p>}

      {currentPage < totalPages && (
        <div className="load-more-wrapper">
          <button
            className="load-more-btn"
            type="button"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}

export default MovieGrid;
