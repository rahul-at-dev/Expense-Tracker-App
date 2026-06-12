const express = require('express')
const Budget = require('../models/Budget')
const Expense = require('../models/Expense')
const protect = require('../middleware/auth')
const mongoose = require('mongoose')

const router = express.Router()
router.use(protect)

function monthKeyFromString(monthStr){
  if(!monthStr){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }
  return monthStr
}

function monthRange(monthKey){
  const [y,m] = monthKey.split('-').map(Number)
  const start = new Date(y, m-1, 1)
  const end = new Date(y, m, 1) // exclusive
  return { start, end }
}

// Create or set budget for a month
router.post('/', async (req, res) => {
  try{
    const userId = req.user.id
    const { amount, month } = req.body
    if (amount === undefined) return res.status(400).json({ success:false, message: 'Amount required' })
    const monthKey = monthKeyFromString(month)
    let budget = await Budget.findOne({ user: userId, month: monthKey })
    if(budget){ budget.amount = amount; budget = await budget.save() }
    else { budget = await Budget.create({ user: userId, amount, month: monthKey }) }
    res.status(200).json({ success:true, data: budget })
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }) }
})

// Update budget by id
router.put('/:id', async (req, res) => {
  try{
    const userId = req.user.id
    let budget = await Budget.findById(req.params.id)
    if(!budget) return res.status(404).json({ success:false, message: 'Budget not found' })
    if(budget.user.toString() !== userId) return res.status(403).json({ success:false, message: 'Not authorized' })
    if(req.body.amount !== undefined) budget.amount = req.body.amount
    budget = await budget.save()
    res.status(200).json({ success:true, data:budget })
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }) }
})

// Get current budget and usage
router.get('/current', async (req, res) => {
  try{
    const userId = req.user.id
    const nowKey = monthKeyFromString()
    const budget = await Budget.findOne({ user: userId, month: nowKey })
    const { start, end } = monthRange(nowKey)
    const agg = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: start, $lt: end } } },
      { $group: { _id: null, spent: { $sum: '$amount' } } }
    ])
    const spent = agg[0]?.spent || 0
    const amount = budget ? budget.amount : 0
    const remaining = amount - spent
    const usage = amount>0 ? Math.min(100, Math.round((spent/amount)*100)) : 0
    res.status(200).json({ success:true, data: { budget: budget || null, spent, remaining, usagePercent: usage } })
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }) }
})

// Get budget for a specific month
router.get('/:month', async (req, res) => {
  try{
    const userId = req.user.id
    const monthKey = monthKeyFromString(req.params.month)
    const budget = await Budget.findOne({ user: userId, month: monthKey })
    const { start, end } = monthRange(monthKey)
    const agg = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: start, $lt: end } } },
      { $group: { _id: null, spent: { $sum: '$amount' } } }
    ])
    const spent = agg[0]?.spent || 0
    const amount = budget ? budget.amount : 0
    const remaining = amount - spent
    const usage = amount>0 ? Math.min(100, Math.round((spent/amount)*100)) : 0
    res.status(200).json({ success:true, data: { budget: budget || null, spent, remaining, usagePercent: usage } })
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }) }
})

module.exports = router
