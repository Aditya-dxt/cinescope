import { getFavourites, addFavourite, removeFavourite } from "../../services/favouritesService";
import type { Movie } from "../../types";

export async function loadFavourites(userId: string | null): Promise<Movie[]> {
  return getFavourites(userId);
}
export async function saveFavourite(userId: string | null, movie: Movie): Promise<void> {
  return addFavourite(userId, movie);
}
export async function deleteFavourite(userId: string | null, imdbID: string): Promise<void> {
  return removeFavourite(userId, imdbID);
}
