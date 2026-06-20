import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getFaculty    = ()       => API.get('/faculty');
export const addFaculty    = (data)   => API.post('/faculty', data);
export const deleteFaculty = (id)     => API.delete(`/faculty/${id}`);

export const getSubjects   = ()       => API.get('/subjects');
export const addSubject    = (data)   => API.post('/subjects', data);
export const deleteSubject = (id)     => API.delete(`/subjects/${id}`);

export const getRooms      = ()       => API.get('/rooms');
export const addRoom       = (data)   => API.post('/rooms', data);
export const deleteRoom    = (id)     => API.delete(`/rooms/${id}`);

export const getTimeslots  = ()       => API.get('/timeslots');
export const addTimeslot   = (data)   => API.post('/timeslots', data);
export const deleteTimeslot= (id)     => API.delete(`/timeslots/${id}`);

export const generateTimetable = ()   => API.post('/timetable/generate');
export const getTimetable      = ()   => API.get('/timetable');

export const getNotes          = ()   => API.get('/notes');
export const addNote           = (data) => API.post('/notes', data);
export const deleteNote        = (id) => API.delete(`/notes/${id}`);

export const getQuestionPapers = ()   => API.get('/question-papers');
export const addQuestionPaper  = (data) => API.post('/question-papers', data);
export const deleteQuestionPaper = (id) => API.delete(`/question-papers/${id}`);

export const getMarksheets     = ()   => API.get('/marksheets');
export const addMarksheet      = (data) => API.post('/marksheets', data);
export const deleteMarksheet   = (id) => API.delete(`/marksheets/${id}`);

export const getAttendanceShortages = () => API.get('/attendance-shortages');
export const addAttendanceShortage  = (data) => API.post('/attendance-shortages', data);
export const deleteAttendanceShortage = (id) => API.delete(`/attendance-shortages/${id}`);
