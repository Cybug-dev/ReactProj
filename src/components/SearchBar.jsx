function SearchBar({ searchText, setSearchText }) {
  function handleClear() {
    setSearchText('');
  }
   return (
    <section className="search-section">
      <h2>Find Your Next Favorite Movie</h2>
      <div className="search-wrapper">
        <input 
        className="search-input"
        text="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search movies, genres, actors..."
         />

            {/* Only show Clear button if something is typed */}
            {searchText && (
              <button className='clear-btn' onClick={handleClear}>Clear</button>
            )}
      </div>
    </section>
   );
}

export default SearchBar;