import React from "react";
import GameStats from "../components/GameStats";
import GameChart from "../components/GameChart";
import GameForm from "../components/GameForm";
import GameTable from "../components/GameTable";

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Players", href: "/admin/players", icon: "👥" },
  { label: "Games", href: "/admin/games", icon: "🎮" },
  { label: "Revenue", href: "/admin/revenue", icon: "$" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

const Games = () => {
  return (
    <div className="min-h-screen bg-[#0f1419] text-white font-sans flex flex-col">
      {/* Header (Menubar) */}
      <header className="bg-gradient-to-r from-indigo-400 to-purple-700 shadow-lg px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="text-xl">🎮</span>
            <span>SpeedyGame</span>
          </div>
          <nav className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-3 py-1 rounded-lg text-[15px] font-medium transition
                  ${link.label === "Games"
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none w-44 md:w-64 placeholder:text-white/60"
            />
            <span className="absolute right-3 top-2 text-white/70 pointer-events-none">🔍</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition">🔔</button>
          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold text-white">JD</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col bg-[#1a1f2e] border-r border-[#2d3748] w-56 py-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium text-[15px] transition-all
                ${link.label === "Games"
                  ? "bg-indigo-500/10 text-indigo-300 border-r-2 border-indigo-400 font-bold"
                  : "text-white/70 hover:bg-indigo-400/10 hover:text-indigo-300"}`}
            >
              <span className="text-[18px] w-6 text-center">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 bg-[#0f1419] overflow-x-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Games Overview</h1>
            <p className="text-white/60 text-[15px]">Manage your game library and monitor performance</p>
          </div>

          {/* Stats Cards */}
          <GameStats />
          {/* Charts */}
          <GameChart />
          {/* Add New Game Form */}
          <GameForm />
          {/* Game Table */}
          <GameTable />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1f2e] border-t border-[#2d3748] py-3 px-6 flex items-center justify-between text-xs text-white/60">
        <div>© 2024 SpeedyGame. All rights reserved.</div>
        <div>
          <a href="#privacy" className="hover:text-indigo-400 transition">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default Games;