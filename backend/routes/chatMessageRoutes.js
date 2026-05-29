const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");

router.get("/:groupId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ groupId: req.params.groupId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newMessage = new ChatMessage(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/react", async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await ChatMessage.findById(req.params.id);
    if (!message) return res.status(404).json("Message not found");

    if (!message.reactions) message.reactions = new Map();
    const count = message.reactions.get(emoji) || 0;
    message.reactions.set(emoji, count + 1);

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
