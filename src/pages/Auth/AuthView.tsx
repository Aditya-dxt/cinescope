import { useAuthViewModel } from "./useAuthViewModel";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";

export function AuthView() {
  const { user } = useAuth();
  const vm = useAuthViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    if (vm.success && user) {
      const t = setTimeout(() => navigate("/"), 600);
      return () => clearTimeout(t);
    }
  }, [vm.success, user, navigate]);

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="page page-narrow">
      <div className="card auth-card">
        <h1 className="auth-title">{vm.mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="muted">{vm.mode === "login" ? "Sign in to sync favourites across devices." : "Join CineScope — favourites are saved per account."}</p>

        <form onSubmit={vm.handleSubmit} className="auth-form" noValidate>
          <label className="label">Email
            <input className="input" type="email" placeholder="you@example.com" value={vm.email} onChange={e => vm.setEmail(e.target.value)} required autoComplete="email" maxLength={254} />
          </label>
          <label className="label">Password
            <input className="input" type="password" placeholder="••••••••" value={vm.password} onChange={e => vm.setPassword(e.target.value)} required minLength={6} maxLength={128} autoComplete={vm.mode==="login"?"current-password":"new-password"} />
          </label>

          {vm.error && <div className="alert alert-error" role="alert">{vm.error}</div>}
          {vm.success && <div className="alert alert-success" role="status">{vm.success} Redirecting…</div>}
          <button type="submit" className="btn-primary btn-block" disabled={vm.loading} aria-busy={vm.loading}>
            {vm.loading ? "Please wait…" : vm.mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <span className="muted">{vm.mode === "login" ? "No account?" : "Have an account?"}</span>
          <button className="btn-ghost" onClick={vm.toggleMode} disabled={vm.loading}>
            {vm.mode === "login" ? "Create one" : "Sign in"}
          </button>
        </div>

        <p className="muted small" style={{ marginTop: 16 }}>
          Demo without Firebase? App works in guest mode — favourites are stored locally. Add Firebase env vars for real auth.
        </p>
      </div>
    </div>
  );
}
