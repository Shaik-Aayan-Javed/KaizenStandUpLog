const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  endTime: { type: String },
  tag: { type: String },
  borderClass: { type: String },
  leftBarBg: { type: String },
  tagColor: { type: String },
  day: { type: Number },
  isActive: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false }
});

module.exports = mongoose.model("Meeting", meetingSchema);
