import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, hasFirebase } from "./firebaseService";

function ensureAuth() {
  if (!hasFirebase || !auth) throw new Error("Firebase not configured. Add VITE_FIREBASE_* env vars or use demo mode.");
}

export async function registerUser(email: string, password: string): Promise<FirebaseUser> {
  ensureAuth();
  try {
    const cred = await createUserWithEmailAndPassword(auth!, email, password);
    return cred.user;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(mapFirebaseError(msg));
  }
}

export async function loginUser(email: string, password: string): Promise<FirebaseUser> {
  ensureAuth();
  try {
    const cred = await signInWithEmailAndPassword(auth!, email, password);
    return cred.user;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(mapFirebaseError(msg));
  }
}

export async function logoutUser(): Promise<void> {
  if (!hasFirebase || !auth) return;
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  if (!hasFirebase || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

function mapFirebaseError(raw: string): string {
  if (raw.includes("auth/email-already-in-use")) return "Email already in use.";
  if (raw.includes("auth/invalid-email")) return "Invalid email address.";
  if (raw.includes("auth/weak-password")) return "Password too weak (min 6 chars).";
  if (raw.includes("auth/invalid-credential") || raw.includes("auth/wrong-password")) return "Invalid email or password.";
  if (raw.includes("auth/user-not-found")) return "No account found for this email.";
  if (raw.includes("auth/too-many-requests")) return "Too many attempts. Try again later.";
  return raw.replace("Firebase:", "").trim();
}
