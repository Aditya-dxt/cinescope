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
    setMode(m => m === "login" ? "register" : "login");
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password);
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
