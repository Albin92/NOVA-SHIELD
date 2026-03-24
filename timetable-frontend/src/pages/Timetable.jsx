import { useEffect, useState } from 'react';
import { getTimetable } from '../api/api';
import Spinner from '../components/Spinner';

const DAYS    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const PERIODS = [1,2,3,4,5,6,7,8];

export default function Timetable() {
  const [schedule, setSchedule] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');

  useEffect(() => {
    const fetchTimetable = () => {
      getTimetable()
        .then(r => { setSchedule(r.data); setLoading(false); })
        .catch(err => console.error(err));
    };

    fetchTimetable();
    const interval = setInterval(fetchTimetable, 3000); // 3 sec polling
    return () => clearInterval(interval);
  }, []);

  const getCell = (day, period) => {
    const term = filter.toLowerCase();
    return schedule.find(e =>
      e.day === day &&
      e.period === period &&
      (!term ||
        e.batch?.toLowerCase().includes(term) ||
        e.faculty_name?.toLowerCase().includes(term) ||
        e.room_number?.toLowerCase().includes(term) ||
        e.department?.toLowerCase().includes(term) ||
        e.subject_name?.toLowerCase().includes(term))
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Timetable</h1>
        <input
          placeholder="Search by department, batch, subject, faculty or room..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-96 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-50 px-4 py-3 text-left text-gray-600 font-medium">Period</th>
              {DAYS.map(d => (
                <th key={d} className="border border-gray-200 bg-[#1E3A5F] text-white px-4 py-3 font-medium">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map(p => (
              <tr key={p}>
                <td className="border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-600">P{p}</td>
                {DAYS.map(d => {
                  const cell = getCell(d, p);
                  return (
                    <td key={d} className={`border border-gray-200 px-3 py-2 min-w-[130px] align-top ${cell ? 'bg-blue-50' : 'bg-white'}`}>
                      {cell ? (
                        <>
                          <p className="font-medium text-gray-800 text-xs">{cell.subject_name}</p>
                          <p className="text-gray-500 text-[11px] leading-tight mt-0.5">{cell.faculty_name}</p>
                          <p className="text-gray-400 text-[11px] leading-tight">Rm {cell.room_number} · Batch {cell.batch}</p>
                          {cell.department && <p className="text-blue-500/80 font-bold mt-1 text-[10px] uppercase tracking-wider">{cell.department}</p>}
                          <p className="text-gray-300 text-[10px] mt-0.5">{cell.start_time} – {cell.end_time}</p>
                        </>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
