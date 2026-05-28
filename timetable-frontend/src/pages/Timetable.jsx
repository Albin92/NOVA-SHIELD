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

  const getCells = (day, period) =>
    schedule.filter(e =>
      e.day === day &&
      e.period === period &&
      (!filter ||
        e.batch?.toLowerCase().includes(filter.toLowerCase()) ||
        e.faculty_name?.toLowerCase().includes(filter.toLowerCase()) ||
        e.subject_name?.toLowerCase().includes(filter.toLowerCase()) ||
        e.room_number?.toLowerCase().includes(filter.toLowerCase()))
    );

  const getBatchBadgeColor = (batch) => {
    const b = batch?.toUpperCase() || '';
    if (b === 'A') return 'bg-indigo-950/60 border-indigo-800/60 text-indigo-300';
    if (b === 'B') return 'bg-purple-950/60 border-purple-900/60 text-purple-300';
    if (b === 'C') return 'bg-pink-950/60 border-pink-900/40 text-pink-300';
    return 'bg-slate-900 border-slate-800 text-slate-300';
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 rounded-full uppercase">
            Schedule Monitor
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">Academic Timetable</h1>
          <p className="text-slate-400 text-sm mt-1">Review schedules and room occupancies across all days and periods.</p>
        </div>
        
        <div className="relative">
          <input
            placeholder="Search by batch, faculty, room or subject..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-80 bg-slate-900 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
          />
          {filter && (
            <button 
              onClick={() => setFilter('')} 
              className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-20 text-center">Period</th>
                {DAYS.map(d => (
                  <th key={d} className="px-6 py-4 min-w-[170px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {PERIODS.map(p => (
                <tr key={p} className="hover:bg-slate-950/10">
                  <td className="px-6 py-5 bg-slate-950/20 text-center border-r border-slate-800/60 align-middle">
                    <span className="font-black text-slate-300 text-sm">P{p}</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase block mt-0.5">Hour</span>
                  </td>
                  {DAYS.map(d => {
                    const cells = getCells(d, p);
                    return (
                      <td key={d} className="px-4 py-3 align-top min-h-[120px] border-r border-slate-850/30 last:border-r-0">
                        <div className="space-y-3">
                          {cells.map(cell => (
                            <div 
                              key={cell.id} 
                              className="group relative bg-slate-950/50 hover:bg-slate-950 border border-slate-850 hover:border-slate-700/80 rounded-xl p-3.5 transition-all duration-300 hover:shadow-lg shadow-sm"
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className={`px-2 py-0.5 border text-[9px] font-bold rounded uppercase tracking-wider ${getBatchBadgeColor(cell.batch)}`}>
                                  Batch {cell.batch}
                                </span>
                                <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded text-[9px] font-bold uppercase tracking-wider">
                                  Rm {cell.room_number}
                                </span>
                              </div>
                              
                              <p className="font-extrabold text-white text-xs tracking-wide leading-tight group-hover:text-indigo-400 transition-colors duration-200">
                                {cell.subject_name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium mt-1">
                                👨‍🏫 {cell.faculty_name || 'Unassigned'}
                              </p>
                              
                              <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-800/40 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{cell.start_time} – {cell.end_time}</span>
                              </div>
                            </div>
                          ))}
                          {cells.length === 0 && (
                            <div className="h-16 flex items-center justify-center border border-dashed border-slate-850/60 rounded-xl text-[10px] text-slate-700 font-medium">
                              — Empty —
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
