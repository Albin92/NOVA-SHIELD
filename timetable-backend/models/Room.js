const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
  room_number: { type: String, required: true },
  capacity:    { type: Number, required: true }
});
module.exports = mongoose.model('Room', RoomSchema);
