import { useState } from "react";
import { login, register } from "./AuthModel";

export function useAuthViewModel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function toggleMode() {
    if (loading) return;
    setMode(m => m === "login" ? "register" : "login");
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (loading) return;
    const em = email.trim();
    const pw = password;
    if (!em || !pw) { setError("Email and password are required."); return; }
    if (pw.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === "login") await login(em, pw);
      else await register(em, pw);
      setSuccess(mode === "login" ? "Logged in!" : "Account created!");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, mode, loading, error, success, handleSubmit, toggleMode };
}
