
import { useEffect, useState } from 'react'
import expenseService from '../services/expenseService'

export default function ExpenseList({ onEdit, onRefresh }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  const categories = [
    'all',
    'Food',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Education',
    'Shopping',
    'Other'
  ]

  useEffect(() => {
    loadExpenses()
  }, [onRefresh])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExpenses()
    }, 400)

    return () => clearTimeout(timer)
  }, [category, search])

  const loadExpenses = async () => {
    try {
      setLoading(true)
      setError('')

      const result = await expenseService.getExpenses(
        category,
        search
      )

      if (result.success) {
        setExpenses(result.data)
        setTotal(result.total)
      }
    } catch (err) {
      setError(err.message || 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this expense?'
      )
    ) {
      try {
        const result =
          await expenseService.deleteExpense(id)

        if (result.success) {
          loadExpenses()
        }
      } catch (err) {
        setError(
          err.message || 'Failed to delete expense'
        )
      }
    }
  }

  const handleReset = () => {
    setCategory('all')
    setSearch('')
  }

  if (loading && expenses.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        Loading expenses...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Filters */}

      <div className="chart-card p-5 md:p-6">

        <h2 className="text-lg md:text-xl font-semibold mb-5">
          Filters
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat.charAt(0).toUpperCase() +
                    cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search expenses..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 transition"
            >
              Reset Filters
            </button>
          </div>

        </div>

      </div>

      {/* Summary */}

      {expenses.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-8 shadow-xl">

          <div className="flex flex-col sm:flex-row gap-6 sm:justify-between sm:items-center">

            <div>
              <p className="opacity-80 text-sm">
                Total Expenses
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                ₹{total.toFixed(2)}
              </h2>
            </div>

            <div className="sm:text-right">
              <p className="opacity-80 text-sm">
                Transactions
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                {expenses.length}
              </h2>
            </div>

          </div>

        </div>
      )}

      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Mobile Cards */}

      <div className="block lg:hidden space-y-4">

        {expenses.length === 0 ? (
          <div className="chart-card p-8 text-center text-slate-500">
            No expenses found.
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="chart-card p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-slate-900">
                  {expense.title}
                </h3>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {expense.category}
                </span>
              </div>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Amount
                  </span>

                  <span className="font-bold text-red-500">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Date
                  </span>

                  <span>
                    {new Date(
                      expense.date
                    ).toLocaleDateString()}
                  </span>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <button
                  onClick={() =>
                    onEdit(expense)
                  }
                  className="w-full py-2 rounded-xl bg-blue-600 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(expense._id)
                  }
                  className="w-full py-2 rounded-xl bg-red-600 text-white"
                >
                  Delete
                </button>

              </div>
            </div>
          ))
        )}

      </div>

      {/* Desktop Table */}

      <div className="hidden lg:block chart-card overflow-hidden">

        {expenses.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No expenses found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-[900px] w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Title
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="border-t hover:bg-slate-50 transition"
                  >

                    <td className="px-6 py-4 font-medium">
                      {expense.title}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {expense.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-red-500">
                      ₹{expense.amount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(
                        expense.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 space-x-2">

                      <button
                        onClick={() =>
                          onEdit(expense)
                        }
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(expense._id)
                        }
                        className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

