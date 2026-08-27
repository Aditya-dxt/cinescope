import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface HeaderProps {
  query?: string;
  setQuery?: (v: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

export function Header({ query = "", setQuery, onSearch, onClear }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSearch, setMobileSearch] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (location.pathname !== "/") navigate("/");
    onSearch?.();
    setMobileSearch(false);
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={onClear}>
          <span className="logo-icon">◆</span> CINESCOPE
          <span className="logo-sub">Discover • Favourite • Watch</span>
        </Link>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            placeholder="Search movies… (e.g. Inception, Batman)"
            value={query}
            onChange={e => setQuery?.(e.target.value)}
          />
          <button type="submit" className="btn-search">Search</button>
          {query && <button type="button" className="btn-clear" onClick={() => { setQuery?.(""); onClear?.(); }}>✕</button>}
        </form>

        <nav className="nav">
          <Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>Home</Link>
          <Link to="/favourites" className={location.pathname === "/favourites" ? "nav-link active" : "nav-link"}>
            Favourites
          </Link>
          {user ? (
            <>
              <span className="nav-user" title={user.email ?? ""}>{user.email?.split("@")[0]}</span>
              <button className="btn-ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">Sign In</Link>
          )}
        </nav>

        <button className="hamburger" onClick={() => setMobileSearch(v => !v)} aria-label="Toggle search">⌕</button>
      </div>

      {mobileSearch && (
        <form className="search-form-mobile" onSubmit={handleSubmit}>
          <input className="search-input" placeholder="Search movies…" value={query} onChange={e => setQuery?.(e.target.value)} autoFocus />
          <button type="submit" className="btn-search">Go</button>
        </form>
      )}
    </header>
  );
}
