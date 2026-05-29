const mongoose = require("mongoose");

const historyLogSchema = new mongoose.Schema({
  dateGroup: { type: String },
  dateGroupColor: { type: String },
  user: { type: String },
  role: { type: String },
  time: { type: String },
  dateFull: { type: String },
  avatar: { type: String },
  snippet: { type: String },
  today: { type: String },
  tomorrow: { type: String },
  blockers: { type: String },
  hasBlockers: { type: Boolean, default: false }
});

module.exports = mongoose.model("HistoryLog", historyLogSchema);
