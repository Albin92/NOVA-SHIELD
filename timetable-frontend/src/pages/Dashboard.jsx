import { useEffect, useState } from 'react';
import { getFaculty, getSubjects, getRooms, getTimeslots, getTimetable, clearTimetable, resetSystem } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState({
    faculty: [], subjects: [], rooms: [], timeslots: [], timetable: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      Promise.all([getFaculty(), getSubjects(), getRooms(), getTimeslots(), getTimetable()])
        .then(([f, s, r, t, tt]) => {
          setData({
            faculty: f.data || [],
            subjects: s.data || [],
            rooms: r.data || [],
            timeslots: t.data || [],
            timetable: tt.data || []
          });
          setLoading(false);
        }).catch(err => console.error(err));
    };

    fetchData(); // run immediately
    const interval = setInterval(fetchData, 3000); // 3 second Real-time sync polling
    return () => clearInterval(interval); // cleanup
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading Dashboard Data...</div>;

  const totalAvailableSlots = data.rooms.length * data.timeslots.length;
  const totalRequiredSlots = data.subjects.reduce((sum, sub) => sum + (parseInt(sub.hours_per_week, 10) || 1), 0);
  const totalRoomCapacity = data.rooms.reduce((sum, r) => sum + (parseInt(r.capacity, 10) || 0), 0);
  const hasCapacityWarning = totalRequiredSlots > totalAvailableSlots;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your automated timetable generator status.</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button onClick={async () => {
            if(window.confirm('Wipe ALL setup data and timetables? This cannot be undone.')) {
              await resetSystem();
            }
          }} className="bg-red-100 text-red-700 px-4 py-2.5 rounded-lg hover:bg-red-200 transition font-medium text-sm md:text-base">
            Reset Data
          </button>
          <button onClick={async () => {
            if(window.confirm('Clear just the generated timetable?')) {
              await clearTimetable();
            }
          }} className="bg-orange-100 text-orange-700 px-4 py-2.5 rounded-lg hover:bg-orange-200 transition font-medium text-sm md:text-base">
            Clear Timetable
          </button>
          <button onClick={() => navigate('/setup')} className="bg-gray-100 text-gray-700 px-4 md:px-6 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium text-sm md:text-base">
            Edit Data
          </button>
          <button onClick={() => navigate('/generate')} className="bg-[#1E3A5F] text-white px-4 md:px-6 py-2.5 rounded-lg hover:bg-blue-900 transition font-medium shadow-md text-sm md:text-base">
            Generate Timetable
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">👩‍🏫</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Faculty</p>
            <p className="text-2xl font-bold text-gray-800">{data.faculty.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">📚</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Subjects Assigned</p>
            <p className="text-2xl font-bold text-gray-800">{data.subjects.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold">🏫</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-800">{data.rooms.length} <span className="text-sm font-normal text-gray-400">({totalRoomCapacity} seats)</span></p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-bold">⏰</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Timeslots Set</p>
            <p className="text-2xl font-bold text-gray-800">{data.timeslots.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Warnings */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-2xl border ${hasCapacityWarning ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${hasCapacityWarning ? 'text-red-800' : 'text-emerald-800'}`}>
              Generation Readiness
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Total Subject Hours</span>
                <span className="font-bold text-gray-900">{totalRequiredSlots}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Maximum Capacity</span>
                <span className="font-bold text-gray-900">{totalAvailableSlots}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              
              {hasCapacityWarning ? (
                <div className="text-sm text-red-700 bg-red-100 p-3 rounded-lg font-medium">
                  ⚠️ Error imminent: You require {totalRequiredSlots - totalAvailableSlots} more slot(s) to successfully generate a timetable.
                </div>
              ) : (
                <div className="text-sm text-emerald-700 bg-emerald-100/50 p-3 rounded-lg font-medium">
                  ✅ System is ready. You have enough capacity to generate the timetable.
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Latest Timetable</h3>
             {data.timetable.length > 0 ? (
               <div className="space-y-2">
                 <p className="text-sm text-gray-600">A generated timetable exists in the database with <strong>{data.timetable.length} scheduled classes</strong>.</p>
                 <p className="text-xs text-gray-400">Created: {new Date(data.timetable[0].generated_at || Date.now()).toLocaleString()}</p>
               </div>
             ) : (
               <p className="text-sm text-gray-500 italic">No timetable has been generated yet.</p>
             )}
          </div>
        </div>

        {/* Right Column: Faculty & Subjects Lists */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Faculty Lists</h3>
            </div>
            {data.faculty.length > 0 ? (
              <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {data.faculty.map(fac => (
                  <li key={fac.id || fac._id} className="p-4 px-6 hover:bg-gray-50 transition">
                    <p className="font-semibold text-gray-900">{fac.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Teaches: {fac.subjects_can_teach?.join(', ') || 'Unassigned'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">No faculty members added yet.</div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Subjects Overview</h3>
            </div>
            {data.subjects.length > 0 ? (
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 font-medium">Subject</th>
                      <th className="px-6 py-3 font-medium">Batch</th>
                      <th className="px-6 py-3 font-medium">Hours/Wk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.subjects.map((sub, i) => (
                      <tr key={sub.id || sub._id || i} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{sub.name}</td>
                        <td className="px-6 py-3 text-gray-500">{sub.batch}</td>
                        <td className="px-6 py-3 text-gray-600 font-semibold">{sub.hours_per_week}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">No subjects currently assigned.</div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
