import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Setup', path: '/setup' },
    { name: 'Generate', path: '/generate' },
    { name: 'Timetable', path: '/timetable' }
  ];

  return (
    <nav className="bg-[#1E3A5F] text-white px-8 py-0 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex gap-8 items-center h-16">
        <span className="font-bold text-xl tracking-wide flex items-center gap-2">
          <span className="text-2xl">📅</span> Nova-shield
        </span>
        <div className="h-6 w-px bg-blue-800/50 mx-2"></div>
        <div className="flex gap-1 h-full">
          {links.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center px-4 h-full text-sm font-medium transition-colors border-b-2 ${
                  isActive ? 'border-blue-400 text-white bg-white/10' : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
