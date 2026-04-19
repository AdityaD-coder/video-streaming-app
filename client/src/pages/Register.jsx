import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign up.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-white/10 bg-ink-900/60 p-8 shadow-xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Create your profile</h1>
        <p className="mt-1 text-sm text-slate-400">Use any email — data stays on your MongoDB instance.</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-300">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 outline-none ring-accent/30 focus:ring-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-slate-300">Password (min 6 characters)</span>
          <input
            required
            minLength={6}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 outline-none ring-accent/30 focus:ring-2"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-ink-950 hover:bg-accent-dim disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Sign up"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-neon hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
