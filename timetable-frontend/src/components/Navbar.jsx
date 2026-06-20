import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/60 px-8 py-3.5 flex justify-between items-center shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
          <span className="font-extrabold text-white text-lg">N</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-sm text-white tracking-widest uppercase bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            NovaShield
          </span>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider -mt-0.5">
            Timetable Engine
          </span>
        </div>
      </div>
      <div className="flex gap-1.5 items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800/40">
        {[
          { path: '/', label: 'Dashboard' },
          { path: '/setup', label: 'Setup Hub' },
          { path: '/generate', label: 'Generate' },
          { path: '/timetable', label: 'Timetable Grid' },
          { path: '/academic-hub', label: 'Academic Hub' }
        ].map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${isActive(tab.path)
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
