function SearchBar({ searchText, setSearchText }) {
  function handleClear() {
    setSearchText("");
  }

  return (
    <section className="search-section">
      <h2>Find Your Next Favorite Movie</h2>
      <div className="search-wrapper">
        <input
          className="search-input"
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search movies, genres, actors..."
        />

        {searchText && (
          <button className="clear-btn" type="button" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>
    </section>
  );
}

export default SearchBar;
