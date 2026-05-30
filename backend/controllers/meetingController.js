const Meeting = require('../models/Meeting');

const getAll = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meetings', error });
  }
};

const create = async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create meeting', error });
  }
};

const update = async (req, res) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Meeting not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update meeting', error });
  }
};

const remove = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete meeting', error });
  }
};

module.exports = { getAll, create, update, remove };
