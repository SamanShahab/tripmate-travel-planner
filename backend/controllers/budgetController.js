const Budget = require('../models/Budget');

const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ tripId: req.params.tripId });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { tripId: req.params.tripId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBudget, updateBudget };
