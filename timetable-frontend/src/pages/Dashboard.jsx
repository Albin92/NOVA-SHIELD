import { useEffect, useState } from 'react';
import { getFaculty, getSubjects, getRooms } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ faculty: 0, subjects: 0, rooms: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getFaculty(), getSubjects(), getRooms()])
      .then(([f, s, r]) => setStats({
        faculty:  f.data.length,
        subjects: s.data.length,
        rooms:    r.data.length
      }));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Faculty',  value: stats.faculty },
          { label: 'Subjects', value: stats.subjects },
          { label: 'Rooms',    value: stats.rooms }
        ].map(card => (
          <div key={card.label} className="bg-white border-l-4 border-blue-700 rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-semibold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/generate')}
        className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition">
        Generate Timetable
      </button>
    </div>
  );
}
