import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { subscribeToAuthChanges, logoutUser } from "../services/authService";
import type { User as FirebaseUser } from "firebase/auth";

interface AuthContextValue {
  user: FirebaseUser | null;
  authLoading: boolean;
  logout: () => Promise<void>;
}

interface AuthProviderProps { children: ReactNode }

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  async function logout() { await logoutUser(); }

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0a0f", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #333", borderTopColor: "#e50914", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ opacity: 0.7 }}>Loading CineScope…</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, authLoading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
