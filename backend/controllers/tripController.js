const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Budget = require('../models/Budget');

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).populate('destination', 'name country image');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id }).populate('destination');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, userId: req.user._id });
    // Auto-create itinerary days
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const itineraries = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      itineraries.push({ tripId: trip._id, day: i + 1, date, title: `Day ${i + 1}`, activities: [] });
    }
    await Itinerary.insertMany(itineraries);
    await Budget.create({ tripId: trip._id });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    await Itinerary.deleteMany({ tripId: req.params.id });
    await Budget.deleteOne({ tripId: req.params.id });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTrips, getTrip, createTrip, updateTrip, deleteTrip };
