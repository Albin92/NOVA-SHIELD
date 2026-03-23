import { useState } from 'react';
import { generateTimetable } from '../api/api';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Generate Timetable</h1>
      <p className="text-sm text-gray-500 mb-6">Make sure you have added faculty, subjects, rooms, and time slots in Setup before generating.</p>
      <button onClick={handleGenerate} disabled={loading}
        className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg hover:bg-blue-900 disabled:opacity-50 transition">
        {loading ? 'Running Algorithm...' : 'Run Algorithm'}
      </button>
      {loading && <Spinner />}
      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 font-medium">Timetable generated successfully!</p>
          <p className="text-green-600 text-sm mt-1">{result.schedule?.length} classes scheduled.</p>
          <button onClick={() => navigate('/timetable')} className="mt-3 bg-[#1E3A5F] text-white px-4 py-2 rounded text-sm hover:bg-blue-900">View Timetable</button>
        </div>
      )}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}
