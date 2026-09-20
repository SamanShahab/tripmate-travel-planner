const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripName: { type: String, required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  destinationName: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travelers: { type: Number, default: 1 },
  budget: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  coverImage: String,
  preferences: [String],
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
