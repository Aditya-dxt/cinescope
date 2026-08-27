import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app;
if (hasFirebaseConfig && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else if (getApps().length > 0) {
  app = getApps()[0];
}

export const auth = hasFirebaseConfig && app ? getAuth(app) : null;
export const db = hasFirebaseConfig && app ? getFirestore(app) : null;
export const hasFirebase = hasFirebaseConfig;

export function isFirebaseConfigured(): boolean { return hasFirebaseConfig; }
