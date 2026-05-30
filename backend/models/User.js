const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Team Member'
  },
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=47'
  }
});

module.exports = mongoose.model("User", userSchema);
