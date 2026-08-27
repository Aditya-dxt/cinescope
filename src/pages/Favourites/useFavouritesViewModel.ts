import { useEffect, useState, useCallback } from "react";
import { loadFavourites, deleteFavourite } from "./FavouritesModel";
import { useAuth } from "../../context/AuthContext";
import type { Movie } from "../../types";

export function useFavouritesViewModel() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadFavourites(user ? user.uid : null);
      setFavourites(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load favourites.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadMovies(); }, [loadMovies]);

  async function removeMovie(imdbID: string) {
    try {
      await deleteFavourite(user ? user.uid : null, imdbID);
      setFavourites(prev => prev.filter(m => m.imdbID !== imdbID));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove favourite.");
    }
  }

  return { favourites, loading, error, loadMovies, removeMovie };
}
