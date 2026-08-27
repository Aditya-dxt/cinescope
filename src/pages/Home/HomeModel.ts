import { searchMovies, getMockMovies } from "../../services/omdbService";
import type { Movie } from "../../types";

const SEED_KEYWORDS = [
  "Batman", "Avengers", "Harry Potter", "Star Wars", "Spider-Man",
  "Marvel", "Disney", "Matrix", "Lord of the Rings", "Fast",
  "Mission Impossible", "Pixar", "Horror", "Comedy", "Action",
  "Inception", "Interstellar", "Titanic", "Avatar", "Jurassic"
];

export async function getMovies(query: string): Promise<Movie[]> {
  const q = query.trim();
  if (q.length < 2) throw new Error("Please enter at least 2 characters.");
  return searchMovies(q);
}

export async function initialMovies(): Promise<Movie[]> {
  // pick 4 random keywords, fetch in parallel, merge, dedupe, shuffle, take 20
  const shuffled = [...SEED_KEYWORDS].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, 4);
  const results = await Promise.all(picks.map(k => searchMovies(k).catch(() => [] as Movie[])));
  const merged = results.flat();
  // dedupe by imdbID
  const map = new Map<string, Movie>();
  for (const m of merged) if (!map.has(m.imdbID)) map.set(m.imdbID, m);
  let arr = [...map.values()];
  // if we have <20 (e.g. mock mode), pad with mock
  if (arr.length < 20) {
    const mocks = getMockMovies();
    for (const mm of mocks) if (!map.has(mm.imdbID) && arr.length < 20) { map.set(mm.imdbID, mm); arr.push(mm); }
  }
  // shuffle final
  arr = arr.sort(() => Math.random() - 0.5);
  // if still using mock expanded list, ensure uniqueness already
  return arr.slice(0, Math.min(20, arr.length));
}
