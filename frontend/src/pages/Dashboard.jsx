
import { useEffect, useState } from 'react'
import analyticsService from '../services/analyticsService'
import budgetService from '../services/budgetService'
import BudgetProgress from '../components/BudgetProgress'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar
} from 'recharts'

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#F97316'
]

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      setLoading(true)

      const [
        sumRes,
        catRes,
        monthlyRes,
        recentRes,
        budgetRes
      ] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategoryExpenses(),
        analyticsService.getMonthly(),
        analyticsService.getRecent(8),
        budgetService.getCurrent()
      ])

      const summaryData = sumRes.success
        ? sumRes.data
        : {
            totalExpenses: 0,
            totalIncome: 0,
            balance: 0
          }

      const categories = catRes.success
        ? catRes.data
        : []

      const monthly = monthlyRes.success
        ? monthlyRes.data
        : []

      const recent = recentRes.success
        ? recentRes.data
        : []

      const budgetInfo = budgetRes.success
        ? budgetRes.data
        : null

      setSummary({
        summaryData,
        categories,
        monthly,
        recent,
        budgetInfo
      })
    } catch (err) {
      setError(
        err.message ||
          'Failed to load dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        Loading dashboard...
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-20 text-slate-500">
        No financial data available
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Financial Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Track income, expenses and budget
          performance.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-3xl p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl hover-lift">

          <p className="text-sm opacity-80">
            Total Income
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            ₹
            {summary.summaryData.totalIncome?.toFixed(
              2
            ) || '0.00'}
          </h2>

          <p className="text-sm opacity-75 mt-3">
            {summary.summaryData.incomeCount || 0}{' '}
            records
          </p>

        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl hover-lift">

          <p className="text-sm opacity-80">
            Total Expenses
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            ₹
            {summary.summaryData.totalExpenses?.toFixed(
              2
            ) || '0.00'}
          </h2>

          <p className="text-sm opacity-75 mt-3">
            {summary.summaryData.expenseCount || 0}{' '}
            transactions
          </p>

        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-xl hover-lift">

          <p className="text-sm opacity-80">
            Remaining Balance
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            ₹
            {(
              summary.summaryData.balance || 0
            ).toFixed(2)}
          </h2>

          <p className="text-sm opacity-75 mt-3">
            Income minus expenses
          </p>

        </div>

      </div>

      {/* Budget */}

      <div className="chart-card p-6 md:p-8">

        <h2 className="text-xl font-semibold mb-6">
          Budget Overview
        </h2>

        <BudgetProgress
          budgetInfo={summary.budgetInfo}
        />

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Pie Chart */}

        <div className="chart-card p-6">

          <h2 className="text-xl font-semibold mb-5">
            Expenses by Category
          </h2>

          {summary.categories.length === 0 ? (
            <p className="text-slate-500">
              No expenses available
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <PieChart>
                <Pie
                  data={summary.categories}
                  dataKey="total"
                  nameKey="category"
                  outerRadius={90}
                  label={false}
                >
                  {summary.categories.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* Line Chart */}

        <div className="chart-card p-6 xl:col-span-2">

          <h2 className="text-xl font-semibold mb-5">
            Monthly Trend
          </h2>

          {summary.monthly.length === 0 ? (
            <p className="text-slate-500">
              No monthly data
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <LineChart
                data={summary.monthly}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Income"
                />

                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

        </div>

      </div>

      {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Bar Chart */}

        <div className="chart-card p-6">

          <h2 className="text-xl font-semibold mb-5">
            Income vs Expense
          </h2>

          {summary.monthly.length === 0 ? (
            <p className="text-slate-500">
              No chart data available
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart
                data={summary.monthly}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="income"
                  fill="#10B981"
                  name="Income"
                />

                <Bar
                  dataKey="expense"
                  fill="#3B82F6"
                  name="Expense"
                />
              </BarChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* Recent Transactions */}

        <div className="chart-card p-6">

          <h2 className="text-xl font-semibold mb-5">
            Recent Transactions
          </h2>

          {summary.recent.length === 0 ? (
            <p className="text-slate-500">
              No recent transactions
            </p>
          ) : (
            <div className="space-y-4">

              {summary.recent.map(
                (transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4"
                  >

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {
                          transaction.title
                        }
                      </h3>

                      <p className="text-sm text-slate-500">
                        {
                          transaction.type
                        }{' '}
                        •{' '}
                        {
                          transaction.label
                        }{' '}
                        •{' '}
                        {new Date(
                          transaction.date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      className={`font-bold text-lg ${
                        transaction.type ===
                        'income'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      ₹
                      {transaction.amount.toFixed(
                        2
                      )}
                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

