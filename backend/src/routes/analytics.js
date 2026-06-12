const express = require('express')
const mongoose = require('mongoose')
const Expense = require('../models/Expense')
const Income = require('../models/Income')
const protect = require('../middleware/auth')

const router = express.Router()

router.use(protect)

// Summary: totals and balance
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id
    const expAgg = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ])
    const incAgg = await Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ])

    const totalExpenses = expAgg[0]?.total || 0
    const expenseCount = expAgg[0]?.count || 0
    const totalIncome = incAgg[0]?.total || 0
    const incomeCount = incAgg[0]?.count || 0

    res.status(200).json({ success: true, data: { totalExpenses, expenseCount, totalIncome, incomeCount, balance: totalIncome - totalExpenses } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Recent transactions (combined incomes + expenses)
router.get('/recent', async (req, res) => {
  try {
    const userId = req.user.id
    const limit = parseInt(req.query.limit || '10', 10)
    const expenses = await Expense.find({ user: userId }).select('title amount category date').lean()
    const incomes = await Income.find({ user: userId }).select('title amount source date').lean()

    const mappedExp = expenses.map(e => ({ ...e, type: 'expense', label: e.category }))
    const mappedInc = incomes.map(i => ({ ...i, type: 'income', label: i.source }))

    const combined = mappedExp.concat(mappedInc).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)

    res.status(200).json({ success: true, data: combined })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Category-wise expense aggregation
router.get('/expenses/by-category', async (req, res) => {
  try {
    const userId = req.user.id
    const agg = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ])
    const data = agg.map(a => ({ category: a._id, total: a.total }))
    res.status(200).json({ success: true, data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Monthly summary for last 12 months (expenses and incomes)
router.get('/monthly', async (req, res) => {
  try {
    const userId = req.user.id
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)

    const expAgg = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: start } } },
      { $project: { year: { $year: '$date' }, month: { $month: '$date' }, amount: '$amount' } },
      { $group: { _id: { year: '$year', month: '$month' }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const incAgg = await Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: start } } },
      { $project: { year: { $year: '$date' }, month: { $month: '$date' }, amount: '$amount' } },
      { $group: { _id: { year: '$year', month: '$month' }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Build a map keyed by YYYY-MM
    const months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months.push({ key, year: d.getFullYear(), month: d.getMonth() + 1 })
    }

    const expMap = new Map(expAgg.map(a => [`${a._id.year}-${String(a._id.month).padStart(2,'0')}`, a.total]))
    const incMap = new Map(incAgg.map(a => [`${a._id.year}-${String(a._id.month).padStart(2,'0')}`, a.total]))

    const result = months.map(m => ({
      month: m.key,
      expense: expMap.get(m.key) || 0,
      income: incMap.get(m.key) || 0
    }))

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
