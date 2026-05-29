const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String }, // 'channel' or 'dm'
  members: { type: Number },
  desc: { type: String },
  status: { type: String },
  avatar: { type: String }
});

module.exports = mongoose.model("Group", groupSchema);
