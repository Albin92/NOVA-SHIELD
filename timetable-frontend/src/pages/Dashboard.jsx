import { useEffect, useState } from 'react';
import { getFaculty, getSubjects, getRooms, getTimeslots } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ faculty: 0, subjects: 0, rooms: 0, timeslots: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getFaculty(), getSubjects(), getRooms(), getTimeslots()])
      .then(([f, s, r, t]) => {
        setStats({
          faculty: f.data.length,
          subjects: s.data.length,
          rooms: r.data.length,
          timeslots: t.data.length
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Faculty Members',
      value: stats.faculty,
      color: 'from-blue-500 to-indigo-500',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      label: 'Academic Subjects',
      value: stats.subjects,
      color: 'from-purple-500 to-pink-500',
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      label: 'Available Rooms',
      value: stats.rooms,
      color: 'from-emerald-500 to-teal-500',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: 'Configured Timeslots',
      value: stats.timeslots,
      color: 'from-amber-500 to-orange-500',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 rounded-full uppercase">
            Control Center
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Welcome to <span className="bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">NovaShield Timetable Engine</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
            Manage resources, configure time periods, assign faculty teaching preferences, and run our advanced CSP scheduling solver in seconds.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Current Configurations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(card => (
          <div
            key={card.label}
            className="group relative bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl card-gradient-top border-t-0" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                {loading ? (
                  <div className="h-9 w-16 bg-slate-800 rounded animate-pulse mt-2" />
                ) : (
                  <p className="text-4xl font-extrabold text-white mt-2 tracking-tight">{card.value}</p>
                )}
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 group-hover:border-slate-700 transition-colors duration-300">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Navigation Grid */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Operations & Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Configure Resources',
            desc: 'Setup and manage faculty, subject listings, rooms, and weekly timeslots.',
            btnText: 'Open Setup Hub',
            path: '/setup',
            gradient: 'from-blue-600 to-indigo-600'
          },
          {
            title: 'Generate Schedule',
            desc: 'Trigger the constraint satisfaction solver algorithm to build your timetable.',
            btnText: 'Run Solver Engine',
            path: '/generate',
            gradient: 'from-purple-600 to-pink-600'
          },
          {
            title: 'View Timetable',
            desc: 'Open the interactive schedule grid to filter and review class periods.',
            btnText: 'Open Timetable Grid',
            path: '/timetable',
            gradient: 'from-emerald-600 to-teal-600'
          }
        ].map(action => (
          <div key={action.title} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">{action.title}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{action.desc}</p>
            </div>
            <button
              onClick={() => navigate(action.path)}
              className={`w-full mt-6 bg-gradient-to-r ${action.gradient} text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 hover:brightness-110 shadow-lg`}
            >
              {action.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
