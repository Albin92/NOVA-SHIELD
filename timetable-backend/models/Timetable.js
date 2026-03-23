const mongoose = require('mongoose');
const TimetableSchema = new mongoose.Schema({
  subject_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  faculty_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  room_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  timeslot_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
  batch:         { type: String },
  generated_at:  { type: Date, default: Date.now }
});
module.exports = mongoose.model('Timetable', TimetableSchema);
