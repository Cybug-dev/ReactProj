import { useState, useEffect } from "react";
import { BASE_URL, API_KEY } from "./config";
import { Navbar, SearchBar, MovieGrid,  MovieModal, FavouritesPage } from "./components/ExportPath";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState("home"); // "home" or "favourites"}
  //Load favourites from localStorage on app start
  // if nothing in localStorage, default to empty array
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("moviedb-favourites");
    return saved ? JSON.parse(saved) : [];
  });

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("moviedb-favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Toggle - if already in favourites, remove it; if not, add it
  function toggleFavourite(movieId) {
    setFavourites(prev => {
      const movie = movies.find(m => m.id === movieId) || favourites.find(m => m.id === movieId);
      if (!movie) return prev;
      const exist = prev.find(m => m.id === movieId);
      return exist ? prev.filter(m => m.id !== movieId) : [...prev, movie];
    });
  }

  //Check if a movie is in favourites
  function isFavourited(movieId) {
    return favourites.some(m => m.id === movieId)
  }

  useEffect(() => {
    // This single useEffect handles BOTH cases:
    // 1. Empty searchText → fetch trending
    // 2. Has searchText → fetch search results

    const fetchMovies = async () => {
      setLoading(true); // show spinner before every fetch
      setError(null); // clear any previous error

      // Build the URL based on whether user is searching or not
      const url = searchText.trim()
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchText)}`
        : `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

      try {
        const response = await fetch(url);

        // if API returns an error status, throw import PropTypes from 'prop-types'
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        // Catch network errors or thrown errors above
        setError(error.message);
        setMovies([]);
      } finally {
        // ALWAYS runs — whether success or error
        setLoading(false);
      }
    };

    // Small delay when searching — waits 500ms after user stops typing
    // Prevents calling API on EVERY single keystroke!
    const timer = setTimeout(fetchMovies, searchText ? 500 : 0);

    // Cleanup — cancel previous timer if user types again quickly
    return () => clearTimeout(timer);
  }, [searchText]); // Re-runs whenever searchText changes

  return (
    <div>
      {/* Pass movies.length so Navbar shows correct count */}
      <Navbar movieCount={movies.length}
      favouriteCount={favourites.length}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage} />

    {/* Swap entire content based on currentPage */}
    {currentPage === "home" ? (
      <>
        {/* Pass both searchText and setSearchText for controlled input */}
        <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {/* Pass ALL four props MovieGrid needs */}
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        searchText={searchText}
        onMovieClick={setSelectedMovie}
         toggleFavourite={toggleFavourite}
            isFavourited={isFavourited}
      />
      </>
    )  : (
      <FavouritesPage 
      favourites={favourites}
      onMovieClick={setSelectedMovie}
      toggleFavourite={toggleFavourite}
      isFavourited={isFavourited}
       />
    )}

      {/* Only render modal if a movie is selected */}
     {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)} 
        />
      )}

    </div>
  );
}

export default App;
