import { useState, useEffect } from "react";
import { BASE_URL, API_KEY } from "./config";
import {
  Navbar,
  SearchBar,
  MovieGrid,
  MovieModal,
  FavouritesPage,
} from "./components/ExportPath";
import "./App.css";
import GenreFilter from "./components/GenreFilter";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState("home"); // "home" or "favourites"
  const [currentMoviePage, setCurrentMoviePage] = useState(1); // For pagination
  //Load favourites from localStorage on app start
  // if nothing in localStorage, default to empty array
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("moviedb-favourites");
    return saved ? JSON.parse(saved) : [];
  });
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("moviedb-favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Toggle - if already in favourites, remove it; if not, add it
  function toggleFavourite(movieId) {
    setFavourites((prev) => {
      const movie =
        movies.find((m) => m.id === movieId) ||
        favourites.find((m) => m.id === movieId);
      if (!movie) return prev;
      const exist = prev.find((m) => m.id === movieId);
      return exist ? prev.filter((m) => m.id !== movieId) : [...prev, movie];
    });
  }

  //Check if a movie is in favourites
  function isFavourited(movieId) {
    return favourites.some((m) => m.id === movieId);
  }

  useEffect(() => {
    setCurrentMoviePage(1); // Reset to first page whenever search text changes
  }, [searchText, selectedGenre]); // Also reset when genre changes

  useEffect(() => {
    // This single useEffect handles BOTH cases:
    // 1. Empty searchText → fetch trending
    // 2. Has searchText → fetch search results

    const fetchMovies = async () => {
      setLoading(true); // show spinner before every fetch
      setError(null); // clear any previous error

      //Logic to determine which URL to fetch based on whether user is searching or not
      let url = "";

      // Build the URL based on whether user is searching or not
      if (searchText.trim()) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchText)}&page=${currentMoviePage}`;
      } else if (selectedGenre) {
        // If a genre is selected, fetch movies for that genre
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${currentMoviePage}`;
      } else {
        // No search text and no genre filter → fetch trending movies
        url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${currentMoviePage}`;
      }

      try {
        const response = await fetch(url);

        // if API returns an error status, throw import PropTypes from 'prop-types'
        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();
        setTotalPages(data.total_pages || 1);
        if (currentMoviePage === 1) {
          setMovies(data.results || []);
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])]);
        }
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
  }, [searchText, selectedGenre, currentMoviePage]); // Re-runs whenever searchText or selectedGenre changes

  // Fetch genres on app start (only need to do this once)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
        );
        if (!response.ok) throw new Error("Failed to fetch genres");
        const data = await response.json();

        //TMDB returns genres as an array of {id, name} objects. We want to convert it to an object like {28: "Action", 35: "Comedy"} for easier lookup later.
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div>
      {/* Pass movies.length so Navbar shows correct count */}
      <Navbar
        movieCount={movies.length}
        favouriteCount={favourites.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Swap entire content based on currentPage */}
      {currentPage === "home" ? (
        <>
          {/* Pass both searchText and setSearchText for controlled input */}
          <SearchBar searchText={searchText} setSearchText={setSearchText} />

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={(id) => {
              setSelectedGenre(id);
              setCurrentMoviePage(1); // Reset to first page when changing genre
              if (id !== null) setSearchText(""); // Clear search when selecting a genre
            }}
          />

          <MovieGrid
            movies={movies}
            loading={loading}
            error={error}
            searchText={searchText}
            onMovieClick={setSelectedMovie}
            toggleFavourite={toggleFavourite}
            isFavourited={isFavourited}
            currentPage={currentMoviePage}
            totalPages={totalPages}
            onLoadMore={() => setCurrentMoviePage((prev) => prev + 1)}
          />
        </>
      ) : (
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
