const HistoryLog = require('../models/HistoryLog');

const getAll = async (req, res) => {
  try {
    const logs = await HistoryLog.find().sort({ _id: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history logs', error });
  }
};

const create = async (req, res) => {
  try {
    const newLog = new HistoryLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create history log', error });
  }
};

module.exports = { getAll, create };
