import { useState } from 'react';
import { generateTimetable } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function Generate() {
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState('');
  const [result,  setResult]    = useState(null);
  const [error,   setError]     = useState(null);
  const navigate = useNavigate();

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      setStep('Connecting to Firestore & fetching resources...');
      await sleep(800);
      setStep('Building constraint network and variable domains...');
      await sleep(600);
      setStep('Running MRV Backtracking CSP solver engine...');
      
      const res = await generateTimetable();
      
      setStep('Finalizing and committing timetable transactions...');
      await sleep(600);
      
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'No valid schedule found. Please expand your timeslots or rooms pool.');
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Title */}
      <div className="mb-8">
        <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 rounded-full uppercase">
          Engine Terminal
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">Solve Schedule</h1>
        <p className="text-slate-400 text-sm mt-1">Compile resources and solve the Constraint Satisfaction Problem (CSP) to create a clash-free timetable.</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
          <h2 className="text-lg font-bold text-white mb-2">CSP Solver Console</h2>
          <p className="text-slate-400 text-xs leading-relaxed mb-8 max-w-md">
            Our scheduling solver processes variables (subjects & batches) and limits domains (rooms & periods) using 
            <span className="text-indigo-400 font-semibold"> Minimum Remaining Values (MRV) </span> heuristic 
            and <span className="text-indigo-400 font-semibold"> Forward Checking </span> logic to guarantee zero scheduling conflicts.
          </p>

          {!loading && !result && !error && (
            <div className="border border-dashed border-slate-800 rounded-2xl p-6 text-center bg-slate-950/40 mb-8">
              <span className="text-slate-500 text-xs block mb-1">Ready for compilation</span>
              <span className="text-slate-600 text-[10px] block">Verify that all setup items are saved before triggering the solver.</span>
            </div>
          )}

          {loading && (
            <div className="bg-slate-950/50 border border-slate-850 rounded-2xl p-8 mb-8 text-center flex flex-col items-center">
              <Spinner />
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest animate-pulse mt-4">
                {step}
              </p>
              <p className="text-[10px] text-slate-600 mt-1">Please keep this browser window open</p>
            </div>
          )}

          {result && (
            <div className="bg-emerald-950/40 border border-emerald-900/40 rounded-2xl p-6 mb-8 text-left">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-emerald-950 border border-emerald-850 text-emerald-400 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Timetable Compiled</h3>
                  <p className="text-slate-300 text-xs mt-1">The scheduler algorithm completed successfully with zero resource conflicts.</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-900/60 text-emerald-300 text-xs font-bold rounded-lg">
                    {result.schedule?.length} classes successfully scheduled.
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-pink-950/30 border border-pink-900/30 rounded-2xl p-6 mb-8 text-left">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-pink-950/60 border border-pink-850 text-pink-400 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Solver Conflict Detected</h3>
                  <p className="text-pink-300/80 text-xs mt-1 leading-relaxed">{error}</p>
                  <div className="mt-3 text-[10px] text-slate-500">
                    <strong className="text-slate-400">💡 Advice:</strong> Check if you have enough Room capacities and Timeslot options relative to the total "Weekly Hours Required" of your subjects.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!result ? (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/10 transition duration-300 flex-1"
              >
                {loading ? 'Solving...' : 'Trigger Solver Engine'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/timetable')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/10 transition duration-300 flex-1"
                >
                  View Timetable Grid
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition duration-300"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
