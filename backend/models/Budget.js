const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  accommodation: { type: Number, default: 0 },
  transportation: { type: Number, default: 0 },
  food: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  shopping: { type: Number, default: 0 },
  other: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
}, { timestamps: true });

budgetSchema.virtual('total').get(function () {
  return this.accommodation + this.transportation + this.food + this.activities + this.shopping + this.other;
});

module.exports = mongoose.model('Budget', budgetSchema);
