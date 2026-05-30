const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember");

router.get("/", async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newMember = new TeamMember(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
