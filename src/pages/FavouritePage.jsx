import MovieCard from "../components/MovieCard";

function FavouritesPage({
  favourites,
  onMovieClick,
  toggleFavourite,
  isFavourited,
}) {
  if (favourites.length === 0) {
    return (
      <div className="state-container">
        <i className="fa-regular fa-heart icon" aria-hidden="true" />
        <h3>No favourites yet</h3>
        <p>Click the heart on any movie to save it here.</p>
      </div>
    );
  }

  return (
    <section className="movie-section">
      <h2 className="section-title">Favourite Movies ({favourites.length})</h2>

      <div className="movie-grid">
        {favourites.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={onMovieClick}
            toggleFavourite={toggleFavourite}
            isFavourited={isFavourited}
          />
        ))}
      </div>
    </section>
  );
}

export default FavouritesPage;
