import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar     from './components/Navbar';
import Dashboard  from './pages/Dashboard';
import Setup      from './pages/Setup';
import Generate   from './pages/Generate';
import Timetable  from './pages/Timetable';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/setup"     element={<Setup />} />
          <Route path="/generate"  element={<Generate />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
