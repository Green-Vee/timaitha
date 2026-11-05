"use client";

interface NavbarProps {
  onOpenModal: (modalType: "discover" | "charts" | "sessions") => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            TIMAITHA
          </span>
        </div>

        {/* Navigation Links triggering Pop-ups */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
          <button
            onClick={() => onOpenModal("discover")}
            className="hover:text-white transition cursor-pointer"
          >
            DISCOVER
          </button>
          <button
            onClick={() => onOpenModal("charts")}
            className="hover:text-white transition cursor-pointer"
          >
            CHARTS
          </button>
          <button
            onClick={() => onOpenModal("sessions")}
            className="hover:text-white transition cursor-pointer"
          >
            LIVE SESSIONS
          </button>
          <a href="#about" className="hover:text-white transition">
            ABOUT
          </a>
        </nav>

        {/* Action Button */}
        <div>
          <a
            href="/admin"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg transition flex items-center space-x-2"
          >
            <span>CONTROL CENTER</span>
          </a>
        </div>
      </div>
    </header>
  );
}
