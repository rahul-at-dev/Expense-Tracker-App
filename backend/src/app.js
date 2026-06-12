require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const analyticsRoutes = require('./routes/analytics');
const budgetRoutes = require('./routes/budgets');
const reportsRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.status(200).json({ message: 'Server is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportsRoutes);

module.exports = app;
