function Navbar({ movieCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🎬 MOVIEDB</div>
      <div className="navbar-count">
        Showing <span>{movieCount}</span> movies
      </div>
    </nav>
  );
}

export default Navbar;