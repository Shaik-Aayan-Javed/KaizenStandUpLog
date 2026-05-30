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

router.put("/:id", async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after' }
    );
    res.status(200).json(updatedMeeting);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
