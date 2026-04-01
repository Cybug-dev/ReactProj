import { SearchBar, MovieGrid, GenreFilter } from "../components/ExportPath";

function HomePage({
  movies,
  loading,
  error,
  searchText,
  setSearchText,
  selectedGenre,
  setSelectedGenre,
  genres,
  onMovieClick,
  toggleFavourite,
  isFavourited,
  currentPage,
  totalPages,
  onLoadMore,
}) {
  return (
    <>
      {/* Pass both searchText and setSearchText for controlled input */}
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={(id) => {
          setSelectedGenre(id);
          if (id !== null) setSearchText("");
        }}
      />

      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        searchText={searchText}
        onMovieClick={onMovieClick}
        toggleFavourite={toggleFavourite}
        isFavourited={isFavourited}
        currentPage={currentPage}
        totalPages={totalPages}
        onLoadMore={onLoadMore}
      />
    </>
  );
}

export default HomePage;
