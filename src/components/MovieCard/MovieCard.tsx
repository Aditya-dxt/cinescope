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
  const alt = poster.includes("placeholder") ? `No poster available for ${movie.Title} (${movie.Year})` : `Poster for ${movie.Title} (${movie.Year})`;
  return (
    <article className="movie-card" aria-labelledby={`title-${movie.imdbID}`}>
      <div className="movie-poster-wrap">
        <img
          src={poster}
          alt={alt}
          className="movie-poster"
          loading="lazy"
          decoding="async"
          width={300}
          height={445}
          onError={e => (e.currentTarget.src = "https://via.placeholder.com/300x445/1a1a2e/ffffff?text=No+Poster")}
        />
        <div className="movie-overlay" aria-hidden="true">
          <span className="movie-type">{movie.Type}</span>
          <span className="movie-year">{movie.Year}</span>
        </div>
      </div>
      <div className="movie-body">
        <h3 id={`title-${movie.imdbID}`} className="movie-title" title={movie.Title}>{movie.Title}</h3>
        <p className="movie-meta">{movie.Year} • {movie.Type}</p>
        {onFavourite && (
          <button className={favourited ? "btn-fav active" : "btn-fav"} onClick={() => onFavourite(movie)} aria-label={favourited ? `Remove ${movie.Title} from favourites` : `Add ${movie.Title} to favourites`} aria-pressed={!!favourited}>
            {favourited ? "♥ Favourited" : "♡ Add to Favourites"}
          </button>
        )}
        {onRemove && (
          <button className="btn-remove" onClick={() => onRemove(movie.imdbID)} aria-label={`Remove ${movie.Title}`}>Remove ✕</button>
        )}
      </div>
    </article>
  );
}
