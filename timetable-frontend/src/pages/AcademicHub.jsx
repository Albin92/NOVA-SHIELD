import { useState, useEffect } from 'react';
import {
  getFaculty,
  getSubjects,
  getNotes,
  addNote,
  deleteNote,
  getQuestionPapers,
  addQuestionPaper,
  deleteQuestionPaper,
  getMarksheets,
  addMarksheet,
  deleteMarksheet,
  getAttendanceShortages,
  addAttendanceShortage,
  deleteAttendanceShortage
} from '../api/api';

export default function AcademicHub() {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'papers', 'marksheets', 'shortages'
  const [notes, setNotes] = useState([]);
  const [papers, setPapers] = useState([]);
  const [marksheets, setMarksheets] = useState([]);
  const [shortages, setShortages] = useState([]);
  
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState('note'); // 'note', 'paper', 'marksheet', 'shortage'
  const [form, setForm] = useState({
    title: '',
    content: '',
    fileUrl: '',
    faculty_id: '',
    subject_id: '',
    year: new Date().getFullYear().toString(),
    examType: 'Internals 1',
    month: 'May'
  });
  const [validationError, setValidationError] = useState('');

  const refreshData = () => {
    setLoading(true);
    Promise.all([
      getFaculty(),
      getSubjects(),
      getNotes(),
      getQuestionPapers(),
      getMarksheets(),
      getAttendanceShortages()
    ])
      .then(([fRes, sRes, nRes, pRes, mRes, aRes]) => {
        setFaculty(fRes.data);
        setSubjects(sRes.data);
        setNotes(nRes.data);
        setPapers(pRes.data);
        setMarksheets(mRes.data);
        setShortages(aRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenModal = (type) => {
    setFormType(type);
    setForm({
      title: '',
      content: '',
      fileUrl: '',
      faculty_id: '',
      subject_id: '',
      year: new Date().getFullYear().toString(),
      examType: type === 'marksheet' ? 'Internals 1' : 'End-Sem',
      month: 'May'
    });
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Common validations
    if (!form.title.trim()) {
      setValidationError('Please enter a title.');
      return;
    }
    if (!form.faculty_id) {
      setValidationError('Please select a faculty member.');
      return;
    }
    if (!form.subject_id) {
      setValidationError('Please select a subject.');
      return;
    }

    try {
      if (formType === 'note') {
        if (!form.content.trim()) {
          setValidationError('Please enter note content.');
          return;
        }
        await addNote(form);
      } else if (formType === 'paper') {
        if (!form.fileUrl.trim()) {
          setValidationError('Please enter a link/URL to the question paper.');
          return;
        }
        await addQuestionPaper(form);
      } else if (formType === 'marksheet') {
        if (!form.fileUrl.trim()) {
          setValidationError('Please enter a link/URL to the marksheet/internals report.');
          return;
        }
        await addMarksheet(form);
      } else if (formType === 'shortage') {
        if (!form.fileUrl.trim()) {
          setValidationError('Please enter a link/URL to the attendance shortage sheet.');
          return;
        }
        await addAttendanceShortage(form);
      }
      handleCloseModal();
      refreshData();
    } catch (err) {
      setValidationError(err.response?.data?.error || 'Failed to save resource.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        refreshData();
      } catch (err) {
        alert('Failed to delete note.');
      }
    }
  };

  const handleDeletePaper = async (id) => {
    if (window.confirm('Are you sure you want to delete this question paper?')) {
      try {
        await deleteQuestionPaper(id);
        refreshData();
      } catch (err) {
        alert('Failed to delete question paper.');
      }
    }
  };

  const handleDeleteMarksheet = async (id) => {
    if (window.confirm('Are you sure you want to delete this marksheet?')) {
      try {
        await deleteMarksheet(id);
        refreshData();
      } catch (err) {
        alert('Failed to delete marksheet.');
      }
    }
  };

  const handleDeleteShortage = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance shortage report?')) {
      try {
        await deleteAttendanceShortage(id);
        refreshData();
      } catch (err) {
        alert('Failed to delete attendance shortage report.');
      }
    }
  };

  // Filtering Logic
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject ? (n.subject?.id === filterSubject || n.subject_id === filterSubject) : true;
    const matchesFaculty = filterFaculty ? (n.faculty?.id === filterFaculty || n.faculty_id === filterFaculty) : true;
    return matchesSearch && matchesSubject && matchesFaculty;
  });

  const filteredPapers = papers.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.examType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.year?.includes(searchQuery);
    const matchesSubject = filterSubject ? (p.subject?.id === filterSubject || p.subject_id === filterSubject) : true;
    const matchesFaculty = filterFaculty ? (p.faculty?.id === filterFaculty || p.faculty_id === filterFaculty) : true;
    return matchesSearch && matchesSubject && matchesFaculty;
  });

  const filteredMarksheets = marksheets.filter(m => {
    const matchesSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.examType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.year?.includes(searchQuery);
    const matchesSubject = filterSubject ? (m.subject?.id === filterSubject || m.subject_id === filterSubject) : true;
    const matchesFaculty = filterFaculty ? (m.faculty?.id === filterFaculty || m.faculty_id === filterFaculty) : true;
    return matchesSearch && matchesSubject && matchesFaculty;
  });

  const filteredShortages = shortages.filter(s => {
    const matchesSearch = s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.month?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject ? (s.subject?.id === filterSubject || s.subject_id === filterSubject) : true;
    const matchesFaculty = filterFaculty ? (s.faculty?.id === filterFaculty || s.faculty_id === filterFaculty) : true;
    return matchesSearch && matchesSubject && matchesFaculty;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-pink-400 bg-pink-950/60 border border-pink-800/60 rounded-full uppercase">
              Academic Hub
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Study Space & <span className="bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">Resource Library</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
              Access lecture notes, study schedules, internals marks, shortage lists, and prior semester question papers shared directly by your faculty.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleOpenModal('note')}
              className="bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-md flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Share Note
            </button>
            <button
              onClick={() => handleOpenModal('paper')}
              className="bg-purple-600/90 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-md flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Post Paper
            </button>
            <button
              onClick={() => handleOpenModal('marksheet')}
              className="bg-pink-600/90 hover:bg-pink-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-md flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Add Marksheet
            </button>
            <button
              onClick={() => handleOpenModal('shortage')}
              className="bg-amber-600/90 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-300 shadow-md flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Add Shortage List
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap border-b border-slate-800/80 mb-6 gap-1">
        <button
          onClick={() => { setActiveTab('notes'); setSearchQuery(''); }}
          className={`px-5 py-3 font-bold text-xs tracking-wider uppercase border-b-2 transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Important Notes
        </button>
        <button
          onClick={() => { setActiveTab('papers'); setSearchQuery(''); }}
          className={`px-5 py-3 font-bold text-xs tracking-wider uppercase border-b-2 transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'papers'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          Question Papers
        </button>
        <button
          onClick={() => { setActiveTab('marksheets'); setSearchQuery(''); }}
          className={`px-5 py-3 font-bold text-xs tracking-wider uppercase border-b-2 transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'marksheets'
              ? 'border-pink-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Marksheets & Internals
        </button>
        <button
          onClick={() => { setActiveTab('shortages'); setSearchQuery(''); }}
          className={`px-5 py-3 font-bold text-xs tracking-wider uppercase border-b-2 transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'shortages'
              ? 'border-amber-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Attendance Shortages
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-8">
        <div className="md:col-span-6 relative">
          <input
            placeholder={`Search ${
              activeTab === 'notes' ? 'notes by content or title' : 
              activeTab === 'papers' ? 'question papers by exam type or title' : 
              activeTab === 'marksheets' ? 'marksheets by exam or title' : 'shortage lists by month or title'
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
          <svg className="absolute left-4 top-3 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="md:col-span-3">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none transition"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none transition"
          >
            <option value="">All Faculty</option>
            {faculty.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading Library...</span>
        </div>
      ) : activeTab === 'notes' ? (
        /* Notes grid */
        filteredNotes.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800/80 rounded-2xl">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Important Notes Shared</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">There are no study notes matching your query. Click "Share Note" to create the first document.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-indigo-950/60 border border-indigo-900/40 text-indigo-300 rounded text-[10px] font-extrabold uppercase tracking-wide">
                      {note.subject?.name || 'General'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : 'Date unknown'}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white tracking-wide group-hover:text-indigo-400 transition duration-300">{note.title}</h3>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed whitespace-pre-wrap line-clamp-6">{note.content}</p>
                </div>

                <div className="border-t border-slate-800/80 mt-6 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                      {note.faculty?.name ? note.faculty.name.substring(0,2) : 'FC'}
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold">{note.faculty?.name || 'Faculty'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.fileUrl && (
                      <a
                        href={note.fileUrl.startsWith('http') ? note.fileUrl : `http://${note.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 tracking-wider uppercase flex items-center gap-1 border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-950/30 px-2 py-1 rounded-lg transition"
                      >
                        File
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[10px] font-bold text-pink-500 hover:text-pink-400 hover:underline tracking-wider uppercase p-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'papers' ? (
        /* Question Papers list */
        filteredPapers.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800/80 rounded-2xl">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Question Papers Shared</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">There are no prior exam papers matching your query. Click "Post Question Paper" to share one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-900/40 text-purple-300 rounded text-[10px] font-extrabold uppercase tracking-wide">
                      {paper.subject?.name || 'Subject'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-full text-[9px] uppercase">
                      Year {paper.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-955/30 px-2 py-0.5 rounded border border-purple-800/30">
                      {paper.examType}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white tracking-wide group-hover:text-purple-400 transition duration-300">{paper.title}</h3>
                </div>

                <div className="border-t border-slate-800/80 mt-6 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-[10px] font-bold text-purple-300">
                      {paper.faculty?.name ? paper.faculty.name.substring(0,2) : 'FC'}
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold">{paper.faculty?.name || 'Faculty'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={paper.fileUrl.startsWith('http') ? paper.fileUrl : `http://${paper.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-white hover:brightness-110 tracking-wider uppercase flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 rounded-lg transition shadow-md"
                    >
                      Open Paper
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                    <button
                      onClick={() => handleDeletePaper(paper.id)}
                      className="text-[10px] font-bold text-slate-500 hover:text-pink-500 hover:underline tracking-wider uppercase p-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'marksheets' ? (
        /* Marksheets & Internals */
        filteredMarksheets.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800/80 rounded-2xl">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Marksheets Shared</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">There are no internal assessment scores or marksheets matching your query. Click "Add Marksheet" to upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarksheets.map((sheet) => (
              <div
                key={sheet.id}
                className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-pink-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-pink-950/60 border border-pink-900/40 text-pink-300 rounded text-[10px] font-extrabold uppercase tracking-wide">
                      {sheet.subject?.name || 'Subject'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-full text-[9px] uppercase">
                      Year {sheet.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-950/30 px-2 py-0.5 rounded border border-pink-800/30">
                      {sheet.examType}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white tracking-wide group-hover:text-pink-400 transition duration-300">{sheet.title}</h3>
                </div>

                <div className="border-t border-slate-800/80 mt-6 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-[10px] font-bold text-pink-300">
                      {sheet.faculty?.name ? sheet.faculty.name.substring(0,2) : 'FC'}
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold">{sheet.faculty?.name || 'Faculty'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={sheet.fileUrl.startsWith('http') ? sheet.fileUrl : `http://${sheet.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-white hover:brightness-110 tracking-wider uppercase flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg transition shadow-md"
                    >
                      View Sheet
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button
                      onClick={() => handleDeleteMarksheet(sheet.id)}
                      className="text-[10px] font-bold text-slate-500 hover:text-pink-500 hover:underline tracking-wider uppercase p-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Attendance Shortages */
        filteredShortages.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800/80 rounded-2xl">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Shortage Lists Shared</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">There are no attendance shortage reports shared for this subject. Click "Add Shortage List" to publish.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShortages.map((short) => (
              <div
                key={short.id}
                className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-900/40 text-amber-300 rounded text-[10px] font-extrabold uppercase tracking-wide">
                      {short.subject?.name || 'Subject'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-full text-[9px] uppercase">
                      Month: {short.month}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white tracking-wide group-hover:text-amber-400 transition duration-300">{short.title}</h3>
                </div>

                <div className="border-t border-slate-800/80 mt-6 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-300">
                      {short.faculty?.name ? short.faculty.name.substring(0,2) : 'FC'}
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold">{short.faculty?.name || 'Faculty'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={short.fileUrl.startsWith('http') ? short.fileUrl : `http://${short.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-slate-950 hover:brightness-110 tracking-wider uppercase flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-lg transition shadow-md"
                    >
                      Open List
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </a>
                    <button
                      onClick={() => handleDeleteShortage(short.id)}
                      className="text-[10px] font-bold text-slate-500 hover:text-pink-500 hover:underline tracking-wider uppercase p-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add Resource Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/30">
              <div>
                <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Post {
                    formType === 'note' ? 'Important Note' : 
                    formType === 'paper' ? 'Question Paper' : 
                    formType === 'marksheet' ? 'Marksheet / Internals' : 'Attendance Shortage Report'
                  }
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Fill in the fields to make the resource visible to students.</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {validationError && (
                <div className="p-3 bg-pink-950/50 border border-pink-800/60 rounded-xl text-pink-400 text-xs font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {validationError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Faculty Author</label>
                  <select
                    value={form.faculty_id}
                    onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition"
                  >
                    <option value="">Select Faculty</option>
                    {faculty.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Course / Subject</label>
                  <select
                    value={form.subject_id}
                    onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Document / Post Title</label>
                <input
                  placeholder={
                    formType === 'note' ? 'e.g. Unit 3 Advanced Algorithms Summary' : 
                    formType === 'paper' ? 'e.g. Mid-Semester Exam Paper' : 
                    formType === 'marksheet' ? 'e.g. B.Tech CS Sem-4 Algorithms Marks' : 'e.g. Algorithms Attendance Shortages - May'
                  }
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                />
              </div>

              {formType === 'note' && (
                /* Notes content block */
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Notes Description / Content</label>
                    <textarea
                      placeholder="Write your study notes summary or guidelines here..."
                      rows="4"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Attachment Link (Optional URL)</label>
                    <input
                      placeholder="e.g. drive.google.com/study-resource-pdf"
                      value={form.fileUrl}
                      onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                    />
                  </div>
                </>
              )}

              {formType === 'paper' && (
                /* Question paper metadata block */
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Exam Category</label>
                      <select
                        value={form.examType}
                        onChange={(e) => setForm({ ...form, examType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition"
                      >
                        <option value="Mid-Sem">Mid-Sem Exam</option>
                        <option value="End-Sem">End-Sem Exam</option>
                        <option value="Class Test">Class Test</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Assignment">Assignment</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Academic Year</label>
                      <input
                        type="number"
                        placeholder="e.g. 2026"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Question Paper Link (URL Link Required)</label>
                    <input
                      placeholder="e.g. drive.google.com/exam-paper-link"
                      value={form.fileUrl}
                      onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                    />
                  </div>
                </>
              )}

              {formType === 'marksheet' && (
                /* Marksheet / Internals metadata block */
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Assessment / Exam Type</label>
                      <select
                        value={form.examType}
                        onChange={(e) => setForm({ ...form, examType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition"
                      >
                        <option value="Internals 1">Internals 1 Marks</option>
                        <option value="Internals 2">Internals 2 Marks</option>
                        <option value="Internals 3">Internals 3 Marks</option>
                        <option value="Semester Final">Semester Final Marks</option>
                        <option value="Practical Exam">Practical Exam Marks</option>
                        <option value="Assignments Score">Assignments Score</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Academic Year</label>
                      <input
                        type="number"
                        placeholder="e.g. 2026"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Spreadsheet / Document Link (URL Link Required)</label>
                    <input
                      placeholder="e.g. docs.google.com/spreadsheets/example-marks"
                      value={form.fileUrl}
                      onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                    />
                  </div>
                </>
              )}

              {formType === 'shortage' && (
                /* Attendance shortages metadata block */
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Report Month</label>
                    <select
                      value={form.month}
                      onChange={(e) => setForm({ ...form, month: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Shortage Document Link (URL Link Required)</label>
                    <input
                      placeholder="e.g. drive.google.com/shortage-sheet"
                      value={form.fileUrl}
                      onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                    />
                  </div>
                </>
              )}

              {/* Submit button */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-lg transition duration-300 hover:brightness-110 ${
                    formType === 'note' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/15' : 
                    formType === 'paper' ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-pink-600/15' : 
                    formType === 'marksheet' ? 'bg-gradient-to-r from-pink-600 to-rose-600 shadow-pink-600/15' : 
                    'bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-600/15'
                  }`}
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
