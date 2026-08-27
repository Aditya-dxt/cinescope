import type { Movie, OmdbSearchResponse } from "../types";

const API_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string | undefined;

// Fallback mock movies when no API key (so app still demos)
const MOCK_MOVIES: Movie[] = [
  { imdbID: "tt0111161", Title: "The Shawshank Redemption", Year: "1994", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg" },
  { imdbID: "tt0068646", Title: "The Godfather", Year: "1972", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { imdbID: "tt0468569", Title: "The Dark Knight", Year: "2008", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg" },
  { imdbID: "tt0108052", Title: "Schindler's List", Year: "1993", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { imdbID: "tt0110912", Title: "Pulp Fiction", Year: "1994", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { imdbID: "tt0167260", Title: "The Lord of the Rings: The Return of the King", Year: "2003", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { imdbID: "tt0120737", Title: "The Lord of the Rings: The Fellowship of the Ring", Year: "2001", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxNC00NTBiLWJlODQtYzY4OGMwMGIwY2RmXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg" },
  { imdbID: "tt0133093", Title: "The Matrix", Year: "1999", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { imdbID: "tt1375666", Title: "Inception", Year: "2010", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg" },
  { imdbID: "tt0816692", Title: "Interstellar", Year: "2014", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
];

export function hasOmdbKey(): boolean {
  return !!API_KEY && API_KEY !== "demo" && API_KEY.length > 3;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const q = query.trim();
  if (!q) throw new Error("Please enter a search term.");
  if (!hasOmdbKey()) {
    // mock search: filter mock list
    await new Promise(r => setTimeout(r, 400));
    const filtered = MOCK_MOVIES.filter(m => m.Title.toLowerCase().includes(q.toLowerCase()));
    if (filtered.length === 0) return MOCK_MOVIES.slice(0, 6);
    return filtered;
  }
  const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status} ${res.statusText}`);
  const data: OmdbSearchResponse = await res.json();
  if (data.Response === "False") throw new Error(data.Error || "No movies found.");
  return data.Search ?? [];
}

export function getMockMovies(): Movie[] { return [...MOCK_MOVIES]; }
