import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ onSearchChange, searchValue }) {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight text-white">
          Stre<span className="text-accent">Anime</span>
        </Link>
        <div className="hidden flex-1 sm:block">
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            type="search"
            placeholder="Search titles or genres…"
            className="w-full max-w-md rounded-full border border-white/10 bg-ink-900/80 px-4 py-2 text-sm text-slate-100 outline-none ring-accent/40 placeholder:text-slate-500 focus:border-accent/50 focus:ring-2"
          />
        </div>
        <nav className="ml-auto flex items-center gap-2 text-sm font-medium">
          {isAuthed && (
            <NavLink
              to="/my-list"
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 transition ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`
              }
            >
              My List
            </NavLink>
          )}
          {isAuthed ? (
            <>
              <span className="hidden max-w-[140px] truncate text-slate-400 sm:inline">{user?.email}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-full border border-white/10 px-3 py-1.5 text-slate-200 hover:border-accent/40 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-3 py-1.5 text-slate-300 hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-accent px-3 py-1.5 font-semibold text-ink-950 shadow-glow hover:bg-accent-dim"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="border-t border-white/5 px-4 py-2 sm:hidden">
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          type="search"
          placeholder="Search…"
          className="w-full rounded-full border border-white/10 bg-ink-900 px-4 py-2 text-sm outline-none focus:border-accent/50"
        />
      </div>
    </header>
  );
}
