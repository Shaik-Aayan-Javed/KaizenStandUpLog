const express = require("express");
const router = express.Router();
const HistoryLog = require("../models/HistoryLog");

router.get("/", async (req, res) => {
  try {
    // Sort by _id desc to get newest first if we want, or just return all
    const logs = await HistoryLog.find().sort({ _id: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newLog = new HistoryLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
