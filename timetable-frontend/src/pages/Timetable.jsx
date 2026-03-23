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
    getTimetable().then(r => { setSchedule(r.data); setLoading(false); });
  }, []);

  const getCell = (day, period) =>
    schedule.find(e =>
      e.day    === day &&
      e.period === period &&
      (!filter ||
        e.batch        === filter ||
        e.faculty_name === filter ||
        e.room_number  === filter)
    );

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Timetable</h1>
        <input
          placeholder="Filter by batch, faculty, or room..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-72"
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
                          <p className="text-gray-500 text-xs">{cell.faculty_name}</p>
                          <p className="text-gray-400 text-xs">{cell.room_number} · Batch {cell.batch}</p>
                          <p className="text-gray-300 text-xs">{cell.start_time} – {cell.end_time}</p>
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
