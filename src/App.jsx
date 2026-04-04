import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { API_KEY, BASE_URL } from "./config";
import {
  FavouritesPage,
  HomePage,
  MovieModal,
  Navbar,
  MovieDetailPage
} from "./components/ExportPath";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem("moviedb-favourites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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
        movies.find((currentMovie) => currentMovie.id === movieId) ||
        favourites.find((currentMovie) => currentMovie.id === movieId);

      if (!movie) {
        return prev;
      }

      const exists = prev.some((currentMovie) => currentMovie.id === movieId);
      return exists
        ? prev.filter((currentMovie) => currentMovie.id !== movieId)
        : [...prev, movie];
    });
  }


  //Check if a movie is in favourites
  function isFavourited(movieId) {
    return favourites.some((movie) => movie.id === movieId);
  }

  useEffect(() => {
    setCurrentMoviePage(1); // Reset to first page whenever search text changes
  }, [searchText, selectedGenre]); // Also reset when genre changes

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      setLoading(true);
      setError(null);

      let url = "";

      // Build the URL based on whether user is searching or not
      if (searchText.trim()) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchText)}&page=${currentMoviePage}`;
      } else if (selectedGenre) {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${currentMoviePage}`;
      } else {
        url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${currentMoviePage}`;
      }

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        const nextMovies = Array.isArray(data.results) ? data.results : [];

        setTotalPages(data.total_pages || 1);
        setMovies((prev) =>
          currentMoviePage === 1 ? nextMovies : [...prev, ...nextMovies],
        );
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }

        setError(fetchError.message);
        if (currentMoviePage === 1) {
          setMovies([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(fetchMovies, searchText ? 700 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchText, selectedGenre, currentMoviePage]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGenres() {
      try {
        const response = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }

        const data = await response.json();
        setGenres(data.genres || []);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("Error fetching genres:", fetchError);
        }
      }
    }

    fetchGenres();
    return () => controller.abort();
  }, []);

  const sharedMovieProps = {
    onMovieClick: setSelectedMovie,
    toggleFavourite,
    isFavourited,
  };

  return (
    <div>
      <Navbar movieCount={movies.length} favouriteCount={favourites.length} />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              movies={movies}
              loading={loading}
              error={error}
              searchText={searchText}
              setSearchText={setSearchText}
              genres={genres}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              currentPage={currentMoviePage}
              totalPages={totalPages}
              onLoadMore={() => setCurrentMoviePage((prev) => prev + 1)}
              {...sharedMovieProps}
            />
          }
        />

        <Route
          path="/favourites"
          element={
            <FavouritesPage favourites={favourites} {...sharedMovieProps} />
          }
        />

        <Route
          path="/movie/:id"
          element={<MovieDetailPage {...sharedMovieProps} />}
        />

      </Routes>

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
