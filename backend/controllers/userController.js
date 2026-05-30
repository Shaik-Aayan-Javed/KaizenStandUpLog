const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User Added', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials.' });
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, title, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, title, avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error });
  }
};

module.exports = { register, login, getAll, updateUser };
