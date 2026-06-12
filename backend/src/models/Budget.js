const mongoose = require('mongoose')

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // format: YYYY-MM
}, { timestamps: true })

module.exports = mongoose.model('Budget', BudgetSchema)
