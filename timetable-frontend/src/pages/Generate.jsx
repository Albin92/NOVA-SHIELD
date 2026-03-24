import { useState } from 'react';
import { generateTimetable } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function Generate() {
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);
  const [error,   setError]     = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await generateTimetable();
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCapacityError = error && error.includes('No valid timetable found');

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Timetable</h1>
      <p className="text-gray-500 mb-8">Run the automated algorithm to schedule all your classes without clashes.</p>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-6">⚙️</div>
        <button onClick={handleGenerate} disabled={loading}
          className="bg-blue-600 outline-none focus:ring-4 focus:ring-blue-100 text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:opacity-70 transition-all shadow-md w-full max-w-sm">
          {loading ? 'Running Algorithm...' : 'Run Generation Algorithm'}
        </button>
      </div>

      {loading && <div className="mt-8 flex justify-center"><Spinner /></div>}
      
      {result && (
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎉</span>
            <h2 className="text-emerald-800 text-lg font-bold">Timetable generated successfully!</h2>
          </div>
          <p className="text-emerald-700 mt-1 mb-4">{result.schedule?.length} classes have been perfectly scheduled with zero clashes.</p>
          <button onClick={() => navigate('/timetable')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
            View New Timetable
          </button>
        </div>
      )}
      
      {error && !isCapacityError && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-800 font-bold text-lg mb-1">Generation Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {isCapacityError && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-amber-800 font-bold text-lg mb-3 flex items-center gap-2">
            ⚠️ Algorithm Failed: No valid timetable found
          </h2>
          <p className="text-amber-900 mb-4">The solver ran out of available slots or hit an impossible clash constraint. Here's how to fix it:</p>
          
          <ul className="list-disc list-inside space-y-2 text-amber-800 mb-6 bg-white/50 p-4 rounded-xl border border-amber-100">
            <li><strong>Check your capacity:</strong> Go to the Setup page and look at the Capacity Tracker. Does your "Required Slots" exceed "Available Slots"? If so, you must add more Timeslots or Rooms.</li>
            <li><strong>Check for impossible constraints:</strong> Did you assign a Faculty member to teach 5 hours of classes, but you only have 4 Timeslots configured for the whole week? That's physically impossible to schedule without double-booking them!</li>
            <li><strong>Check Batch clashing:</strong> Similarly, make sure you aren't requiring a single Student Batch to attend more classes than there are available Timeslots.</li>
          </ul>

          <Link to="/setup" className="inline-block bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-700 transition shadow-sm">
            Go to Setup to fix data
          </Link>
        </div>
      )}
    </div>
  );
}
