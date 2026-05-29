const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String },
  statusColor: { type: String },
  textColor: { type: String },
  avatar: { type: String }
});

module.exports = mongoose.model("TeamMember", teamMemberSchema);
