const Destination = require('../models/Destination');
const User = require('../models/User');

const getDestinations = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = {};
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } },
    ];
    const destinations = await Destination.find(query);
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDestination = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destination not found' });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDestination = async (req, res) => {
  try {
    const dest = await Destination.create(req.body);
    res.status(201).json(dest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveDestination = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const destId = req.params.id;
    const idx = user.savedDestinations.indexOf(destId);
    if (idx > -1) {
      user.savedDestinations.splice(idx, 1);
    } else {
      user.savedDestinations.push(destId);
    }
    await user.save();
    res.json({ savedDestinations: user.savedDestinations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDestinations, getDestination, createDestination, saveDestination };
