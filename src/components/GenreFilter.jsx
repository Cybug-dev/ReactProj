import React from "react";

const GenreFilter = ({ genres, selectedGenre, setSelectedGenre }) => {
  return (
    <div className="genre-filter"> 

    <button 
    className={selectedGenre === null ? "active" : ""}
    onClick={() => setSelectedGenre(null)}>All</button>

    {genres.map(genre => (
      <button
      key={genre.id}
      className={selectedGenre === genre.id ? "active" : ""}
      onClick={() => setSelectedGenre(genre.id)}
    >
      {genre.name}
    </button>
  ))}
    </div>
  );
};

export default GenreFilter;