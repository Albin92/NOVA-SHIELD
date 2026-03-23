import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <nav className="bg-[#1E3A5F] text-white px-8 py-4 flex gap-8 items-center shadow">
      <span className="font-bold text-lg tracking-wide">Timetable Generator</span>
      <Link to="/"          className="hover:text-blue-300 text-sm">Dashboard</Link>
      <Link to="/setup"     className="hover:text-blue-300 text-sm">Setup</Link>
      <Link to="/generate"  className="hover:text-blue-300 text-sm">Generate</Link>
      <Link to="/timetable" className="hover:text-blue-300 text-sm">Timetable</Link>
    </nav>
  );
}
