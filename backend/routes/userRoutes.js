const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register Endpoint
router.post("/add-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Simple check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User Added", user: newUser });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
