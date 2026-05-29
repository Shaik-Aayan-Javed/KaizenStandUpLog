const express = require("express");
const router = express.Router();
const Group = require("../models/Group");

router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newGroup = new Group(req.body);
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
