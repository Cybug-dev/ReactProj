import MovieCard from "./MovieCard";

function MovieGrid({ movies, loading, error, searchText, onMovieClick, toggleFavourite, isFavourited }) {
  //Loading this.state
  if (loading) 
    return (
      <div className="spinner-wrapper"> 
      <div className="spinner"></div>
      </div>
    );
  
  //Error this.state
  if (error) {
    return (
      <div className="state-container">
        <div className="icon">😕</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
 }
    //Empty this.state
    if (movies.length === 0) {
      return (
      <div className="state-container">
         <div className="icon">🎬</div>
          <h3>No movies found</h3>
        <p>
          {searchText
            ? `No results for "${searchText}"`
            : "Start searching for movies above!"}
        </p>
      </div>
      );
  }

   // Success state — render the grid

    return (
    <section className="movie-section">
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard 
          key={movie.id} 
          movie={movie} 
          onMovieClick={onMovieClick}
          toggleFavourite={toggleFavourite}
          isFavourited={isFavourited}/>
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;
