import type { Movie } from "../../types";

interface Props {
  movie: Movie;
  onFavourite?: (m: Movie) => void;
  onRemove?: (id: string) => void;
  favourited?: boolean;
  variant?: "grid" | "list";
}

export function MovieCard({ movie, onFavourite, onRemove, favourited }: Props) {
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x445/1a1a2e/ffffff?text=No+Poster";
  return (
    <div className="movie-card">
      <div className="movie-poster-wrap">
        <img src={poster} alt={movie.Title} className="movie-poster" loading="lazy" onError={e => (e.currentTarget.src = "https://via.placeholder.com/300x445/1a1a2e/ffffff?text=No+Poster")} />
        <div className="movie-overlay">
          <span className="movie-type">{movie.Type}</span>
          <span className="movie-year">{movie.Year}</span>
        </div>
      </div>
      <div className="movie-body">
        <h3 className="movie-title" title={movie.Title}>{movie.Title}</h3>
        <p className="movie-meta">{movie.Year} • {movie.Type}</p>
        {onFavourite && (
          <button className={favourited ? "btn-fav active" : "btn-fav"} onClick={() => onFavourite(movie)}>
            {favourited ? "♥ Favourited" : "♡ Add to Favourites"}
          </button>
        )}
        {onRemove && (
          <button className="btn-remove" onClick={() => onRemove(movie.imdbID)}>Remove ✕</button>
        )}
      </div>
    </div>
  );
}
