import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar     from './components/Navbar';
import Dashboard  from './pages/Dashboard';
import Setup      from './pages/Setup';
import Generate   from './pages/Generate';
import Timetable  from './pages/Timetable';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full pb-12">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/setup"     element={<Setup />} />
            <Route path="/generate"  element={<Generate />} />
            <Route path="/timetable" element={<Timetable />} />
          </Routes>
        </main>
        
        {/* Global Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto shrink-0 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 font-medium tracking-wide">
              Copyright Nova-shield 2026
            </p>
            <p className="text-xs text-gray-400 mt-1">Automated Timetable Generation System</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
