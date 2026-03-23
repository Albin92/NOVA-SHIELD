import { useState, useEffect } from 'react';
import {
  getFaculty, addFaculty, deleteFaculty,
  getSubjects, addSubject, deleteSubject,
  getRooms, addRoom, deleteRoom
} from '../api/api';

export default function Setup() {
  const [tab, setTab]           = useState('faculty');
  const [faculty, setFaculty]   = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms]       = useState([]);
  const [form, setForm]         = useState({});

  useEffect(() => {
    getFaculty().then(r => setFaculty(r.data));
    getSubjects().then(r => setSubjects(r.data));
    getRooms().then(r => setRooms(r.data));
  }, []);

  const handleSubmit = async () => {
    if (tab === 'faculty')  { await addFaculty(form);  getFaculty().then(r => setFaculty(r.data)); }
    if (tab === 'subjects') { await addSubject(form);  getSubjects().then(r => setSubjects(r.data)); }
    if (tab === 'rooms')    { await addRoom(form);     getRooms().then(r => setRooms(r.data)); }
    setForm({});
  };

  const tabs = ['faculty', 'subjects', 'rooms'];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Setup</h1>
      <div className="flex gap-3 mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${tab === t ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 max-w-md">
        {tab === 'faculty' && (<>
          <input placeholder="Faculty name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2 mb-3 text-sm"/>
          <input placeholder="Subjects (comma separated)" value={form.subjects_can_teach || ''} onChange={e => setForm({...form, subjects_can_teach: e.target.value.split(',')})} className="w-full border rounded px-3 py-2 mb-3 text-sm"/>
        </>)}
        {tab === 'subjects' && (<>
          <input placeholder="Subject name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2 mb-3 text-sm"/>
          <input placeholder="Batch (e.g. A)" value={form.batch || ''} onChange={e => setForm({...form, batch: e.target.value})} className="w-full border rounded px-3 py-2 mb-3 text-sm"/>
          <input placeholder="Hours per week" type="number" value={form.hours_per_week || ''} onChange={e => setForm({...form, hours_per_week: e.target.value})} className="w-full border rounded px-3 py-2 mb-3 text-sm"/>
        </>)}
        {tab === 'rooms' && (<>
          <input placeholder="Room number" value={form.room_number || ''} onChange={e => setForm({...form, room_number: e.target.value})} className="w-full border rounded px-3 py-2 mb-3 text-sm"/>
          <input placeholder="Capacity" type="number" value={form.capacity || ''} onChange={e => setForm({...form, capacity: e.target.value})} className="w-full border rounded px-3 py-2 mb-3 text-sm"/>
        </>)}
        <button onClick={handleSubmit} className="bg-[#1E3A5F] text-white px-5 py-2 rounded text-sm hover:bg-blue-900">Add</button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl">
        <table className="w-full text-sm">
          <tbody>
            {(tab === 'faculty'  ? faculty  : tab === 'subjects' ? subjects : rooms).map(item => (
              <tr key={item._id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-800">{item.name || item.room_number}</td>
                <td className="px-4 py-3 text-gray-500">{item.batch || item.capacity || ''}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={async () => {
                    if (tab === 'faculty')  { await deleteFaculty(item._id);  getFaculty().then(r => setFaculty(r.data)); }
                    if (tab === 'subjects') { await deleteSubject(item._id);  getSubjects().then(r => setSubjects(r.data)); }
                    if (tab === 'rooms')    { await deleteRoom(item._id);     getRooms().then(r => setRooms(r.data)); }
                  }} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
