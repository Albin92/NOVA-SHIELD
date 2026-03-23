const mongoose = require('mongoose');
const FacultySchema = new mongoose.Schema({
  name:                 { type: String, required: true },
  subjects_can_teach:   { type: [String], default: [] }
});
module.exports = mongoose.model('Faculty', FacultySchema);
