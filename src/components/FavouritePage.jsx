import MovieCard from "./MovieCard";

function FavouritesPage({ favourites, onMovieClick, toggleFavourite, isFavourited }) 
{
  if (favourites.length === 0) {

    return (
       <div className="state-container">
        <div className="icon">💔</div>
        <h3>No favourites yet</h3>
        <p>Click the ❤️ on any movie to save it here</p>
      </div>
    )
  }
      

    return (
      <section className="movie-section">

        <h2 className="section-title"> ⭐ Favourite Movies ({favourites.length})</h2>

        <div className="movie-grid">
          {favourites.map(movie => (
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