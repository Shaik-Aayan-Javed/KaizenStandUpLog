const Group = require('../models/Group');

const getAll = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups', error });
  }
};

const create = async (req, res) => {
  try {
    const newGroup = new Group(req.body);
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create group', error });
  }
};

module.exports = { getAll, create };
