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

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000); // 3 sec polling
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    getFaculty().then(r => setFaculty(r.data));
    getSubjects().then(r => setSubjects(r.data));
    getRooms().then(r => setRooms(r.data));
    getTimeslots().then(r => setTimeslots(r.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 'faculty')  { await addFaculty(form); }
    if (tab === 'subjects') { await addSubject(form); }
    if (tab === 'rooms')    { await addRoom(form); }
    if (tab === 'timeslots'){ await addTimeslot(form); }
    setForm({});
    refreshData();
  };

  const totalAvailableSlots = rooms.length * timeslots.length;
  const totalRequiredSlots = subjects.reduce((acc, sub) => acc + (parseInt(sub.hours_per_week, 10) || 1), 0);
  const hasCapacityWarning = totalRequiredSlots > totalAvailableSlots;

  const tabs = ['faculty', 'rooms', 'timeslots', 'subjects'];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setup Data</h1>
          <p className="text-gray-500 mt-1 text-sm">Add your resources below to prepare for timetable generation.</p>
        </div>
        
        {/* Capacity Tracker */}
        <div className={`p-4 rounded-xl border flex items-center gap-6 shadow-sm ${hasCapacityWarning ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Available Slots</p>
            <p className="text-2xl font-bold text-gray-800">{totalAvailableSlots}</p>
            <p className="text-xs text-gray-400 mt-1">{rooms.length} rooms × {timeslots.length} timeslots</p>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Required Slots</p>
            <p className={`text-2xl font-bold ${hasCapacityWarning ? 'text-red-600' : 'text-blue-600'}`}>{totalRequiredSlots}</p>
            <p className="text-xs text-gray-400 mt-1">Sum of subject hours</p>
          </div>
          {hasCapacityWarning && (
            <div className="text-xs font-semibold text-red-600 max-w-[150px] leading-tight">
              Warning: Not enough slots! Add more rooms or timeslots.
            </div>
          )}
        </div>
      </div>

      {/* Quick Setup Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-blue-800 font-bold text-lg mb-2 flex items-center gap-2">
           ℹ️ Quick Setup Guide
        </h2>
        <div className="text-blue-900 text-sm space-y-3 leading-relaxed">
          <p>Welcome! To generate a successful timetable, you need to perfectly balance your <strong>Subjects</strong> with your available <strong>Rooms</strong> and <strong>Timeslots</strong>.</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Step 1 (Faculty):</strong> Add your teachers first so you can assign them to subjects later.</li>
            <li><strong>Step 2 (Rooms & Timeslots):</strong> Create the empty physical spaces and time blocks your school has available. The system multiplies Rooms × Timeslots to find your maximum capacity.</li>
            <li><strong>Step 3 (Subjects):</strong> Add the classes you want to teach. <span className="font-semibold bg-blue-100 px-1 rounded">Crucially, the sum of all 'Hours / Week' across your subjects CANNOT exceed your maximum capacity</span>. Otherwise, generation will fail!</li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-max">
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); setForm({}); }}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${tab === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 capitalize">Add New {tab}</h2>
            
            {tab === 'faculty' && (<div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required placeholder="e.g. Prof. Smith" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input required placeholder="e.g. Computer Science" value={form.department || ''} onChange={e => setForm({...form, department: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (Comma separated)</label>
                <input required placeholder="e.g. Math, Physics" value={form.subjects_can_teach || ''} onChange={e => setForm({...form, subjects_can_teach: e.target.value.split(',').map(s => s.trim())})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
            </div>)}

            {tab === 'rooms' && (<div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Identifier</label>
                <input required placeholder="e.g. Room 101" value={form.room_number || ''} onChange={e => setForm({...form, room_number: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Capacity</label>
                <input required placeholder="e.g. 40" type="number" min="1" value={form.capacity || ''} onChange={e => setForm({...form, capacity: parseInt(e.target.value, 10)})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
            </div>)}

            {tab === 'timeslots' && (<div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of the Week</label>
                <select required value={form.day || ''} onChange={e => setForm({...form, day: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white">
                  <option value="" disabled>Select a Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period Number</label>
                <input required placeholder="e.g. 1" type="number" min="1" value={form.period || ''} onChange={e => setForm({...form, period: parseInt(e.target.value, 10)})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input required type="time" value={form.start_time || ''} onChange={e => setForm({...form, start_time: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input required type="time" value={form.end_time || ''} onChange={e => setForm({...form, end_time: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
                </div>
              </div>
            </div>)}

            {tab === 'subjects' && (<div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input required placeholder="e.g. Mathematics" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input required placeholder="e.g. Computer Science" value={form.department || ''} onChange={e => setForm({...form, department: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Faculty</label>
                <select required value={form.faculty_id || ''} onChange={e => setForm({...form, faculty_id: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white">
                  <option value="" disabled>Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f.id || f._id} value={f.id || f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Batch</label>
                  <input required placeholder="e.g. Batch A" value={form.batch || ''} onChange={e => setForm({...form, batch: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours / Week</label>
                  <input required placeholder="e.g. 3" type="number" min="1" value={form.hours_per_week || ''} onChange={e => setForm({...form, hours_per_week: parseInt(e.target.value, 10)})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"/>
                </div>
              </div>
            </div>)}

            <button type="submit" className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors">
              Add {tab.slice(0, -1)}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Existing {tab}</h3>
            </div>
            {(() => {
              const items = tab === 'faculty' ? faculty : tab === 'subjects' ? subjects : tab === 'rooms' ? rooms : timeslots;
              if (items.length === 0) {
                return <div className="p-8 text-center text-gray-500 text-sm">No {tab} added yet. Use the form to add one.</div>;
              }
              return (
                <ul className="divide-y divide-gray-200">
                  {items.map(item => {
                    const itemId = item.id || item._id;
                    return (
                      <li key={itemId} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.name || item.room_number || `${item.day} - Period ${item.period}`}
                            {item.department && <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 font-normal">{item.department}</span>}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {tab === 'faculty' && `Can teach: ${item.subjects_can_teach ? item.subjects_can_teach.join(', ') : 'None'}`}
                            {tab === 'rooms' && `Capacity: ${item.capacity} students`}
                            {tab === 'timeslots' && `Time: ${item.start_time} to ${item.end_time}`}
                            {tab === 'subjects' && `Batch: ${item.batch} | Hours/Week: ${item.hours_per_week}`}
                          </p>
                        </div>
                        <button 
                          onClick={async () => {
                            if (tab === 'faculty')  { await deleteFaculty(itemId); }
                            if (tab === 'subjects') { await deleteSubject(itemId); }
                            if (tab === 'rooms')    { await deleteRoom(itemId); }
                            if (tab === 'timeslots'){ await deleteTimeslot(itemId); }
                            refreshData();
                          }} 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100">
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
