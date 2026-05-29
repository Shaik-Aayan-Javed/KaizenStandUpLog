const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  sender: { type: String, required: true },
  avatar: { type: String },
  time: { type: String },
  text: { type: String },
  reactions: { type: Map, of: Number }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
