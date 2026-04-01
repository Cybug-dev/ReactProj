import { Link, useLocation } from "react-router-dom";

function Navbar({ movieCount, favouriteCount }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">🎬 MOVIEDB</div>

      {/* Navigation links */}
      <div className="navbar-nav">
        <Link
          to="/"
          className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
        >
          🏠 Home
        </Link>

        <Link
          to="/favourites"
          className={`nav-btn ${location.pathname === "/favourites" ? "active" : ""}`}
        >
          ⭐ Favourites
          {favouriteCount > 0 && (
            <span className="favourite-badge">{favouriteCount}</span>
          )}
        </Link>
      </div>

      {location.pathname === "/" && (
        <div className="navbar-count">
          Showing <span>{movieCount}</span> movies
        </div>
      )}

      {location.pathname === "/favourites" && (
        <div className="navbar-count">
          You have <span>{favouriteCount}</span> favourite movies
        </div>
      )}
    </nav>
  );
}

export default Navbar;
