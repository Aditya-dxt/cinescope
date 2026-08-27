import { useFavouritesViewModel } from "./useFavouritesViewModel";
import { MovieCard } from "../../components/MovieCard/MovieCard";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function FavouritesView() {
  const { user } = useAuth();
  const { favourites, loading, error, removeMovie } = useFavouritesViewModel();

  if (!user) {
    return (
      <div className="page page-narrow">
        <div className="card auth-card">
          <h2>Sign in to see your favourites</h2>
          <p className="muted">Favourites are saved per account (Firestore when configured, localStorage otherwise).</p>
          <Link to="/auth" className="btn-primary" style={{ marginTop: 16, display: "inline-block" }}>Go to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Your Favourites</h1>
      <p className="muted">{favourites.length} saved • synced to {user.email}</p>

      {loading && <div className="loading">Loading favourites…</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && favourites.length === 0 && !error && (
        <div className="empty">
          <p>No favourites yet.</p>
          <Link to="/" className="btn-primary">Discover movies</Link>
        </div>
      )}

      <div className="grid">
        {favourites.map(m => (
          <MovieCard key={m.imdbID} movie={m} onRemove={removeMovie} />
        ))}
      </div>
    </div>
  );
}
