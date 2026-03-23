const mongoose = require('mongoose');
const SubjectSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  batch:          { type: String, required: true },
  hours_per_week: { type: Number, required: true },
  faculty_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }
});
module.exports = mongoose.model('Subject', SubjectSchema);
