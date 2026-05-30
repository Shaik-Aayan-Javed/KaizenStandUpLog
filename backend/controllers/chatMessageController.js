const ChatMessage = require('../models/ChatMessage');

const getAll = async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};

const getByGroup = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ groupId: req.params.groupId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group messages', error });
  }
};

const create = async (req, res) => {
  try {
    const newMessage = new ChatMessage(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await ChatMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (!message.reactions) message.reactions = new Map();
    const count = message.reactions.get(emoji) || 0;
    message.reactions.set(emoji, count + 1);
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reaction', error });
  }
};

module.exports = { getAll, getByGroup, create, addReaction };
