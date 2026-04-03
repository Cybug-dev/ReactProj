import { Link, useLocation } from "react-router-dom";

function Navbar({ movieCount, favouriteCount }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <i className="fa-solid fa-film" aria-hidden="true" />
        <span>MOVIEDB</span>
      </div>

      <div className="navbar-nav">
        <Link
          to="/"
          className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
        >
          <i className="fa-solid fa-house" aria-hidden="true" />
          <span>Home</span>
        </Link>

        <Link
          to="/favourites"
          className={`nav-btn ${location.pathname === "/favourites" ? "active" : ""}`}
        >
          <i className="fa-solid fa-star" aria-hidden="true" />
          <span>Favourites</span>
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
