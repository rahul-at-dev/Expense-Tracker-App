const express = require('express');
const Income = require('../models/Income');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

// Create income
router.post('/', async (req, res) => {
  try {
    const { title, amount, source, description, date } = req.body;
    if (!title || amount === undefined || !source || !date) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const income = await Income.create({
      user: req.user.id,
      title,
      amount,
      source,
      description,
      date,
    });

    res.status(201).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get incomes with search & filter
router.get('/', async (req, res) => {
  try {
    const { source, search, startDate, endDate } = req.query;
    let query = { user: req.user.id };

    if (source && source !== 'all') query.source = source;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const ed = new Date(endDate);
        ed.setHours(23,59,59,999);
        query.date.$lte = ed;
      }
    }

    const incomes = await Income.find(query).sort({ date: -1 });
    const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    res.status(200).json({ success: true, count: incomes.length, total, data: incomes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single income
router.get('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    if (income.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    res.status(200).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update income
router.put('/:id', async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    if (income.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const { title, amount, source, description, date } = req.body;
    if (title !== undefined) income.title = title;
    if (amount !== undefined) income.amount = amount;
    if (source !== undefined) income.source = source;
    if (description !== undefined) income.description = description;
    if (date !== undefined) income.date = date;

    income = await income.save();
    res.status(200).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete income
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    if (income.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    await Income.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stats summary by source
router.get('/stats/summary', async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id });
    const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const bySource = incomes.reduce((acc, inc) => { acc[inc.source] = (acc[inc.source] || 0) + inc.amount; return acc; }, {});
    res.status(200).json({ success: true, data: { total, bySource, count: incomes.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
