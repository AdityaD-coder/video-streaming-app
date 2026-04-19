import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950">
      <Navbar searchValue={search} onSearchChange={setSearch} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet context={{ search }} />
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        Student demo — sample video: Big Buck Bunny (public domain test asset).
      </footer>
    </div>
  );
}
