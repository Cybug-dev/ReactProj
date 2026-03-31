function Navbar({ movieCount, favouriteCount, currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🎬 MOVIEDB</div>

    {/* Navigation buttons */}
    <div className="navbar-nav">

      <button 
        className={`nav-btn ${currentPage === "home" ? "active" : ""}`}
        onClick={() => setCurrentPage("home")}
      >
         🏠 Home
      </button>

      <button 
        className={`nav-btn ${currentPage === "favourites" ? "active" : ""}`}
        onClick={() => setCurrentPage("favourites")}
      >
         ⭐ Favourites 
         {favouriteCount > 0 && (
          <span className="favourite-badge">{favouriteCount}</span>
         )}
      </button>
    </div>

    {currentPage === "home" && (
      <div className="navbar-count">
        Showing <span>{movieCount}</span> movies
      </div>
    )}

    {currentPage === "favourites" && (
      <div className="navbar-count">
        You have <span>{favouriteCount}</span> favourite movies
      </div>
    )}
      
    </nav>
  );
}

export default Navbar;