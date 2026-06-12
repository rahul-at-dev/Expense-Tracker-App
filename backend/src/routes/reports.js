const express = require('express')
const PDFDocument = require('pdfkit')
const Expense = require('../models/Expense')
const Income = require('../models/Income')
const protect = require('../middleware/auth')

const router = express.Router()

// Helper: convert array of objects to CSV string
function toCSV(rows, headers) {
  const cols = headers
  const lines = [cols.join(',')]
  rows.forEach((r) => {
    const line = cols.map((c) => {
      const v = r[c] == null ? '' : String(r[c])
      // escape quotes
      return `"${v.replace(/"/g, '""')}"`
    })
    lines.push(line.join(','))
  })
  return lines.join('\n')
}

function parseRange(req) {
  const start = req.query.start ? new Date(req.query.start) : null
  const end = req.query.end ? new Date(req.query.end) : null
  return { start, end }
}

function inRangeFilter(userId, start, end) {
  const filter = { user: userId }
  if (start || end) {
    filter.date = {}
    if (start) filter.date.$gte = start
    if (end) filter.date.$lte = end
  }
  return filter
}

// CSV export for expenses
router.get('/expenses/csv', protect, async (req, res) => {
  try {
    const { start, end } = parseRange(req)
    const filter = inRangeFilter(req.user.id, start, end)
    const expenses = await Expense.find(filter).sort({ date: -1 }).lean()

    const rows = expenses.map((e) => ({
      Date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
      Title: e.title || '',
      Category: e.category || '',
      Amount: e.amount != null ? e.amount : '',
      Description: e.description || '',
    }))

    const csv = toCSV(rows, ['Date', 'Title', 'Category', 'Amount', 'Description'])
    const startLabel = start ? start.toISOString().split('T')[0] : 'all'
    const endLabel = end ? end.toISOString().split('T')[0] : 'all'
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="expenses_${startLabel}_${endLabel}.csv"`)
    return res.send(csv)
  } catch (error) {
    console.error('Error exporting expenses CSV', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// CSV export for incomes
router.get('/incomes/csv', protect, async (req, res) => {
  try {
    const { start, end } = parseRange(req)
    const filter = inRangeFilter(req.user.id, start, end)
    const incomes = await Income.find(filter).sort({ date: -1 }).lean()

    const rows = incomes.map((i) => ({
      Date: i.date ? new Date(i.date).toISOString().split('T')[0] : '',
      Title: i.title || '',
      Source: i.source || '',
      Amount: i.amount != null ? i.amount : '',
      Description: i.description || '',
    }))

    const csv = toCSV(rows, ['Date', 'Title', 'Source', 'Amount', 'Description'])
    const startLabel = start ? start.toISOString().split('T')[0] : 'all'
    const endLabel = end ? end.toISOString().split('T')[0] : 'all'
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="incomes_${startLabel}_${endLabel}.csv"`)
    return res.send(csv)
  } catch (error) {
    console.error('Error exporting incomes CSV', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Summary JSON (for preview) and PDF generation
router.get('/summary', protect, async (req, res) => {
  try {
    const { start, end } = parseRange(req)
    const filter = inRangeFilter(req.user.id, start, end)

    const [expenses, incomes] = await Promise.all([
      Expense.find(filter).lean(),
      Income.find(filter).lean(),
    ])

    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0)
    const totalIncome = incomes.reduce((s, i) => s + (i.amount || 0), 0)
    const balance = totalIncome - totalExpenses

    // category breakdown
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + (e.amount || 0)
      return acc
    }, {})

    return res.json({ success: true, data: { totalExpenses, totalIncome, balance, byCategory } })
  } catch (error) {
    console.error('Error fetching summary', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// PDF summary
router.get('/summary/pdf', protect, async (req, res) => {
  try {
    const { start, end } = parseRange(req)
    const filter = inRangeFilter(req.user.id, start, end)

    const [expenses, incomes] = await Promise.all([
      Expense.find(filter).lean(),
      Income.find(filter).lean(),
    ])

    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0)
    const totalIncome = incomes.reduce((s, i) => s + (i.amount || 0), 0)
    const balance = totalIncome - totalExpenses

    // build PDF
    const doc = new PDFDocument({ margin: 40 })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="financial_summary.pdf"')
    doc.pipe(res)

    doc.fontSize(20).text('Financial Summary', { align: 'center' })
    doc.moveDown()

    doc.fontSize(12).text(`Period: ${start ? start.toISOString().split('T')[0] : 'All'} - ${end ? end.toISOString().split('T')[0] : 'All'}`)
    doc.moveDown()

    doc.fontSize(14).text(`Total Income: $${totalIncome.toFixed(2)}`)
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`)
    doc.text(`Balance: $${balance.toFixed(2)}`)
    doc.moveDown()

    doc.fontSize(12).text('Expenses by Category:')
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + (e.amount || 0)
      return acc
    }, {})
    Object.keys(byCategory).forEach((cat) => {
      doc.text(`- ${cat}: $${byCategory[cat].toFixed(2)}`)
    })

    doc.end()
  } catch (error) {
    console.error('Error generating summary PDF', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Monthly expense report (JSON)
router.get('/expenses/monthly', protect, async (req, res) => {
  try {
    const month = req.query.month // expected YYYY-MM
    if (!month) return res.status(400).json({ success: false, message: 'month is required (YYYY-MM)' })
    const [year, mon] = month.split('-').map((s) => parseInt(s, 10))
    const start = new Date(year, mon - 1, 1)
    const end = new Date(year, mon, 0)
    const filter = inRangeFilter(req.user.id, start, end)
    const expenses = await Expense.find(filter).sort({ date: -1 }).lean()
    const total = expenses.reduce((s, e) => s + (e.amount || 0), 0)
    return res.json({ success: true, data: { month, total, transactions: expenses } })
  } catch (error) {
    console.error('Error monthly expenses', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Monthly income report (JSON)
router.get('/incomes/monthly', protect, async (req, res) => {
  try {
    const month = req.query.month // expected YYYY-MM
    if (!month) return res.status(400).json({ success: false, message: 'month is required (YYYY-MM)' })
    const [year, mon] = month.split('-').map((s) => parseInt(s, 10))
    const start = new Date(year, mon - 1, 1)
    const end = new Date(year, mon, 0)
    const filter = inRangeFilter(req.user.id, start, end)
    const incomes = await Income.find(filter).sort({ date: -1 }).lean()
    const total = incomes.reduce((s, i) => s + (i.amount || 0), 0)
    return res.json({ success: true, data: { month, total, transactions: incomes } })
  } catch (error) {
    console.error('Error monthly incomes', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Category-wise expense report (JSON)
router.get('/expenses/by-category', protect, async (req, res) => {
  try {
    const { start, end } = parseRange(req)
    const filter = inRangeFilter(req.user.id, start, end)
    const agg = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ])
    return res.json({ success: true, data: agg })
  } catch (error) {
    console.error('Error category report', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
