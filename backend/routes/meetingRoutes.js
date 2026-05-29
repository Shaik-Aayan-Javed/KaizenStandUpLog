const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
