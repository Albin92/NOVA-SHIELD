import { useState, useEffect } from 'react';
import {
  getFaculty, addFaculty, deleteFaculty,
  getSubjects, addSubject, deleteSubject,
  getRooms, addRoom, deleteRoom,
  getTimeslots, addTimeslot, deleteTimeslot
} from '../api/api';

export default function Setup() {
  const [tab, setTab]           = useState('faculty');
  const [faculty, setFaculty]   = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms]       = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [form, setForm]         = useState({});
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);
  const [saving, setSaving]     = useState(false);

  const refreshAll = () => {
    setError(null);
    Promise.all([
      getFaculty(),
      getSubjects(),
      getRooms(),
      getTimeslots()
    ]).then(([f, s, r, t]) => {
      setFaculty(f.data);
      setSubjects(s.data);
      setRooms(r.data);
      setTimeslots(t.data);
    }).catch(err => {
      const msg = err.response?.data?.error || err.message || 'Failed to connect to backend';
      setError('⚠️ Cannot reach the server: ' + msg + '. Make sure the backend is running on port 5000.');
    });
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (tab === 'faculty')  {
        const cleanForm = {
          ...form,
          subjects_can_teach: form.subjects_can_teach
            ? form.subjects_can_teach.split(',').map(s => s.trim()).filter(Boolean)
            : []
        };
        await addFaculty(cleanForm);
      }
      if (tab === 'subjects') {
        const cleanForm = {
          ...form,
          hours_per_week: parseInt(form.hours_per_week, 10) || 1
        };
        await addSubject(cleanForm);
      }
      if (tab === 'rooms')    {
        const cleanForm = {
          ...form,
          capacity: parseInt(form.capacity, 10) || 0
        };
        await addRoom(cleanForm);
      }
      if (tab === 'timeslots') {
        const cleanForm = {
          ...form,
          period: parseInt(form.period, 10) || 1
        };
        await addTimeslot(cleanForm);
      }
      setForm({});
      setSuccess('✅ Saved successfully!');
      refreshAll();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Save failed';
      setError('❌ Error: ' + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      if (tab === 'faculty')   { await deleteFaculty(id); }
      if (tab === 'subjects')  { await deleteSubject(id); }
      if (tab === 'rooms')     { await deleteRoom(id); }
      if (tab === 'timeslots') { await deleteTimeslot(id); }
      refreshAll();
    } catch (err) {
      setError('❌ Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const tabs = ['faculty', 'subjects', 'rooms', 'timeslots'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="mb-8">
        <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 rounded-full uppercase">
          Settings Hub
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">Resource Configuration</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your departments, faculty profiles, subjects, room assignments, and scheduling timeslots.</p>
      </div>

      {/* Error / Success banners */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-sm">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-emerald-300 text-sm">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/60 max-w-md">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setForm({}); }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-bold capitalize tracking-wider transition-all duration-300 ${
              tab === t
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel (Left) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
            Add {tab === 'faculty' ? 'Faculty Member' : tab === 'subjects' ? 'Subject' : tab === 'rooms' ? 'Room' : 'Timeslot'}
          </h2>

          <div className="space-y-4">
            {tab === 'faculty' && (
              <>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Faculty Name</label>
                  <input
                    placeholder="e.g. Dr. Veena"
                    value={form.name || ''}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Department</label>
                  <input
                    placeholder="e.g. BBA"
                    value={form.department || ''}
                    onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Teachable Subjects (comma separated)</label>
                  <input
                    placeholder="e.g. DigitalMarketing, Buisness"
                    value={form.subjects_can_teach || ''}
                    onChange={e => setForm({...form, subjects_can_teach: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
              </>
            )}

            {tab === 'subjects' && (
              <>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Subject Name</label>
                  <input
                    placeholder="e.g. ADVJAVA"
                    value={form.name || ''}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Department</label>
                  <input
                    placeholder="e.g. BCA"
                    value={form.department || ''}
                    onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Target Batch / Section</label>
                  <input
                    placeholder="e.g. A"
                    value={form.batch || ''}
                    onChange={e => setForm({...form, batch: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Weekly Hours Required</label>
                  <input
                    placeholder="e.g. 2"
                    type="number"
                    value={form.hours_per_week || ''}
                    onChange={e => setForm({...form, hours_per_week: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Assigned Faculty</label>
                  <select
                    value={form.faculty_id || ''}
                    onChange={e => setForm({...form, faculty_id: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  >
                    <option value="" className="bg-slate-950 text-slate-500">Select Faculty</option>
                    {faculty.map(f => (
                      <option key={f.id} value={f.id} className="bg-slate-950 text-white">{f.name} ({f.department})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {tab === 'rooms' && (
              <>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Room Number / ID</label>
                  <input
                    placeholder="e.g. 201"
                    value={form.room_number || ''}
                    onChange={e => setForm({...form, room_number: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Seat Capacity</label>
                  <input
                    placeholder="e.g. 60"
                    type="number"
                    value={form.capacity || ''}
                    onChange={e => setForm({...form, capacity: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
              </>
            )}

            {tab === 'timeslots' && (
              <>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Weekday</label>
                  <select
                    value={form.day || ''}
                    onChange={e => setForm({...form, day: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  >
                    <option value="" className="bg-slate-950 text-slate-500">Select Day</option>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                      <option key={d} value={d} className="bg-slate-950 text-white">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Period Number (1 - 8)</label>
                  <select
                    value={form.period || ''}
                    onChange={e => setForm({...form, period: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  >
                    <option value="" className="bg-slate-950 text-slate-500">Select Period</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                      <option key={p} value={p} className="bg-slate-950 text-white">Period {p}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Start Time</label>
                    <input
                      type="time"
                      value={form.start_time || ''}
                      onChange={e => setForm({...form, start_time: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">End Time</label>
                    <input
                      type="time"
                      value={form.end_time || ''}
                      onChange={e => setForm({...form, end_time: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/10 transition duration-300"
            >
              {saving ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </div>

        {/* List Panel (Right) */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/60 flex justify-between items-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Configured {tab}
            </h2>
            <span className="text-xs text-indigo-400 font-bold bg-indigo-950/60 border border-indigo-900/40 px-2.5 py-1 rounded-full">
              {(tab === 'faculty' ? faculty : tab === 'subjects' ? subjects : tab === 'rooms' ? rooms : timeslots).length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider">
                  {tab === 'faculty' && (
                    <>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Teachable Subjects</th>
                    </>
                  )}
                  {tab === 'subjects' && (
                    <>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Batch</th>
                      <th className="px-6 py-4 text-center">Hours/Wk</th>
                      <th className="px-6 py-4">Assigned Faculty</th>
                    </>
                  )}
                  {tab === 'rooms' && (
                    <>
                      <th className="px-6 py-4">Room ID</th>
                      <th className="px-6 py-4">Seat Capacity</th>
                    </>
                  )}
                  {tab === 'timeslots' && (
                    <>
                      <th className="px-6 py-4">Weekday</th>
                      <th className="px-6 py-4 text-center">Period</th>
                      <th className="px-6 py-4">Time Duration</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(tab === 'faculty' ? faculty : tab === 'subjects' ? subjects : tab === 'rooms' ? rooms : timeslots).map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                    {tab === 'faculty' && (
                      <>
                        <td className="px-6 py-4 text-white font-bold text-sm">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-lg uppercase tracking-wide">
                            {item.department || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {item.subjects_can_teach?.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-indigo-950/60 border border-indigo-900/40 text-indigo-300 rounded text-[10px] font-medium">
                                {s}
                              </span>
                            )) || <span className="text-slate-600 italic">None</span>}
                          </div>
                        </td>
                      </>
                    )}

                    {tab === 'subjects' && (
                      <>
                        <td className="px-6 py-4 text-white font-bold text-sm">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-lg uppercase tracking-wide">
                            {item.department || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-900/40 text-purple-300 rounded text-[10px] font-bold">
                            Batch {item.batch}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-200 text-sm">{item.hours_per_week}h</td>
                        <td className="px-6 py-4 text-slate-300 font-medium">
                          {item.faculty_id?.name ? (
                            <span className="text-indigo-400 font-bold">{item.faculty_id.name}</span>
                          ) : (
                            <span className="text-slate-600 italic">Unassigned</span>
                          )}
                        </td>
                      </>
                    )}

                    {tab === 'rooms' && (
                      <>
                        <td className="px-6 py-4 text-white font-bold text-sm">Room {item.room_number}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-900/40 text-emerald-300 rounded-lg text-xs font-bold">
                            {item.capacity} Seats
                          </span>
                        </td>
                      </>
                    )}

                    {tab === 'timeslots' && (
                      <>
                        <td className="px-6 py-4 text-white font-bold text-sm">{item.day}</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-200">P{item.period}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-900/40 text-amber-300 rounded-lg font-bold tracking-wide">
                            {item.start_time} – {item.end_time}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-pink-500 hover:text-pink-400 font-bold tracking-wider hover:underline transition uppercase text-[10px]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(tab === 'faculty' ? faculty : tab === 'subjects' ? subjects : tab === 'rooms' ? rooms : timeslots).length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-600 italic text-sm bg-slate-900/10">
                      No {tab} added yet. Please use the form on the left to add resources.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
