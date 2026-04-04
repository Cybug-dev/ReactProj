import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_KEY, BASE_URL, IMAGE_BASE_URL } from "../config";

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   setLoading(true);
    //runs when: component first loads, or Id changes
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.success === false) {
        setError("Movie not found")
      } else {
        setMovie(data);
      }
      setLoading(false);
    });

  }, [id])

  if (loading) return <p>Loading...</p>;
if (error)   return <p>{error}</p>;

  return (
    <div className="movie-detail-page">
      <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
      <h1>{movie.title}</h1>
      <p>{movie.vote_average?.toFixed(1)}</p>
      <p>{movie.overview}</p>
      </div>
  );

}

export default MovieDetailPage;