import type { Movie } from "../types";
import { db, hasFirebase } from "./firebaseService";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

const LS_KEY = (uid: string) => `cinescope_favs_${uid}`;
const LS_GUEST = "cinescope_favs_guest";

function lsGet(uid: string | null): Movie[] {
  try {
    const key = uid ? LS_KEY(uid) : LS_GUEST;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Movie[]) : [];
  } catch { return []; }
}
function lsSet(uid: string | null, movies: Movie[]) {
  const key = uid ? LS_KEY(uid) : LS_GUEST;
  localStorage.setItem(key, JSON.stringify(movies));
}

export async function addFavourite(userId: string | null, movie: Movie): Promise<void> {
  if (!movie?.imdbID) throw new Error("Invalid movie.");
  // try Firestore if configured and we have userId
  if (hasFirebase && db && userId) {
    try {
      await setDoc(doc(db, "users", userId, "favourites", movie.imdbID), movie);
      // also mirror to LS for instant UI
      const cur = lsGet(userId);
      if (!cur.find(m => m.imdbID === movie.imdbID)) lsSet(userId, [...cur, movie]);
      return;
    } catch (e) {
      console.warn("Firestore add failed, falling back to LS", e);
    }
  }
  const cur = lsGet(userId);
  if (cur.find(m => m.imdbID === movie.imdbID)) return;
  lsSet(userId, [...cur, movie]);
}

export async function removeFavourite(userId: string | null, imdbID: string): Promise<void> {
  if (!imdbID) throw new Error("Missing imdbID.");
  if (hasFirebase && db && userId) {
    try { await deleteDoc(doc(db, "users", userId, "favourites", imdbID)); } catch (e) { console.warn(e); }
  }
  const cur = lsGet(userId);
  lsSet(userId, cur.filter(m => m.imdbID !== imdbID));
}

export async function getFavourites(userId: string | null): Promise<Movie[]> {
  if (hasFirebase && db && userId) {
    try {
      const snap = await getDocs(collection(db, "users", userId, "favourites"));
      const fromFb = snap.docs.map(d => d.data() as Movie);
      if (fromFb.length > 0) {
        lsSet(userId, fromFb);
        return fromFb;
      }
    } catch (e) { console.warn("Firestore get failed, using LS", e); }
  }
  return lsGet(userId);
}

export async function isFavourite(userId: string | null, imdbID: string): Promise<boolean> {
  const list = await getFavourites(userId);
  return list.some(m => m.imdbID === imdbID);
}
