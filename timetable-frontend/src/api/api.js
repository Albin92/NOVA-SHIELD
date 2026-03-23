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
