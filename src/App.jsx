import { useState, useEffect } from "react";
import { BASE_URL, API_KEY } from "./config";
import { Navbar, SearchBar, MovieGrid,  MovieModal } from "./components/ExportPath";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

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
      <Navbar movieCount={movies.length} />

      {/* Pass both searchText and setSearchText for controlled input */}
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {/* Pass ALL four props MovieGrid needs */}
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        searchText={searchText}
        onMovieClick={setSelectedMovie}
      />

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
