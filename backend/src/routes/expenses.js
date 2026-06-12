const express = require('express');
const Expense = require('../models/Expense');
const protect = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    // Validation
    if (!title || amount === undefined || !category || !date) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses with search and filter
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, search, startDate, endDate } = req.query;
    let query = { user: req.user.id };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        query.date.$lte = endDateObj;
      }
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get a single expense
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this expense' });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this expense' });
    }

    const { title, amount, category, description, date } = req.body;

    // Update fields
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date !== undefined) expense.date = date;

    expense = await expense.save();

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    await Expense.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/expenses/stats/summary
// @desc    Get expense summary (total, by category)
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Group by category
    const byCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        total,
        byCategory,
        count: expenses.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
