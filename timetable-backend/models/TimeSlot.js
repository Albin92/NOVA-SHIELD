const mongoose = require('mongoose');
const TimeSlotSchema = new mongoose.Schema({
  day:        { type: String, required: true },
  period:     { type: Number, required: true },
  start_time: { type: String, required: true },
  end_time:   { type: String, required: true }
});
module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
