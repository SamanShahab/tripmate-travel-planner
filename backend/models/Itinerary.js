const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: String,
  title: String,
  description: String,
  notes: String,
  type: { type: String, enum: ['hotel', 'food', 'sightseeing', 'transport', 'activity', 'other'], default: 'activity' },
  order: { type: Number, default: 0 },
});

const itinerarySchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  day: { type: Number, required: true },
  date: Date,
  title: String,
  activities: [activitySchema],
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
