const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  type: String,
});

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  images: [String],
  category: { type: String, enum: ['Mountains', 'Beaches', 'Culture', 'Adventure', 'Food', 'Weekend'] },
  bestTimeToVisit: String,
  estimatedDailyBudget: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  places: [placeSchema],
  travelTips: [String],
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
