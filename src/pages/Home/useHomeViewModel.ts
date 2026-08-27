import { useEffect, useState, useCallback } from "react";
import { getMovies, initialMovies } from "./HomeModel";
import { addFavourite } from "../../services/favouritesService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../types";

export function useHomeViewModel() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favFeedback, setFavFeedback] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadInitial = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const data = await initialMovies();
      setMovies(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load movies.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => { loadInitial(); }, [loadInitial]);

  // reload when navigating back to home with empty query - handled by caller via effect on mount
  // expose reload for bugfix: when user clears search, show initial

  async function handleSearch() {
    const q = query.trim();
    if (!q) {
      await loadInitial();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getMovies(q);
      setMovies(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFavourite(movie: Movie) {
    if (!user) {
      navigate("/favourites");
      return;
    }
    try {
      await addFavourite(user.uid, movie);
      setFavFeedback(`Added \"${movie.Title}\" to favourites`);
      setTimeout(() => setFavFeedback(null), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add favourite.");
    }
  }

  function clearSearch() {
    setQuery("");
    loadInitial();
  }

  return {
    query, setQuery, movies, loading, initialLoading, error,
    favFeedback, handleSearch, handleFavourite, clearSearch, loadInitial
  };
}
