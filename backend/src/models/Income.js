const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: 0,
    },
    source: {
      type: String,
      enum: ['Salary', 'Business', 'Interest', 'Investment', 'Gifts', 'Other'],
      required: [true, 'Please select a source'],
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
