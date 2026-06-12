import { useEffect, useState } from 'react'
import incomeService from '../services/incomeService'

export default function IncomeList({ onEdit, onRefresh }) {
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [source, setSource] = useState('all')
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  const sources = [
    'all',
    'Salary',
    'Business',
    'Interest',
    'Investment',
    'Gifts',
    'Other'
  ]

  useEffect(() => {
    loadIncomes()
  }, [onRefresh])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadIncomes()
    }, 400)

    return () => clearTimeout(timer)
  }, [source, search])

  const loadIncomes = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await incomeService.getIncomes(
        source,
        search
      )

      if (res.success) {
        setIncomes(res.data)
        setTotal(res.total)
      }
    } catch (err) {
      setError(err.message || 'Failed to load incomes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income?')) {
      return
    }

    try {
      const res = await incomeService.deleteIncome(id)

      if (res.success) {
        loadIncomes()
      }
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  const handleReset = () => {
    setSource('all')
    setSearch('')
  }

  if (loading && incomes.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        Loading incomes...
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
              Source
            </label>

            <select
              value={source}
              onChange={(e) =>
                setSource(e.target.value)
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sources.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
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
              placeholder="Search incomes..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {incomes.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-8 shadow-xl">

          <div className="flex flex-col sm:flex-row gap-6 sm:justify-between sm:items-center">

            <div>
              <p className="opacity-80 text-sm">
                Total Income
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                ₹{total.toFixed(2)}
              </h2>
            </div>

            <div className="sm:text-right">
              <p className="opacity-80 text-sm">
                Records
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                {incomes.length}
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

        {incomes.length === 0 ? (
          <div className="chart-card p-8 text-center text-slate-500">
            No income records found.
          </div>
        ) : (
          incomes.map((income) => (
            <div
              key={income._id}
              className="chart-card p-5"
            >

              <div className="flex justify-between items-start mb-3">

                <h3 className="font-semibold text-slate-900">
                  {income.title}
                </h3>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {income.source}
                </span>

              </div>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Amount
                  </span>

                  <span className="font-bold text-green-600">
                    ₹{income.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Date
                  </span>

                  <span>
                    {new Date(
                      income.date
                    ).toLocaleDateString()}
                  </span>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <button
                  onClick={() =>
                    onEdit(income)
                  }
                  className="w-full py-2 rounded-xl bg-blue-600 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(income._id)
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

        {incomes.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No income records found.
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
                    Source
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

                {incomes.map((income) => (
                  <tr
                    key={income._id}
                    className="border-t hover:bg-slate-50 transition"
                  >

                    <td className="px-6 py-4 font-medium">
                      {income.title}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {income.source}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-green-600">
                      ₹{income.amount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(
                        income.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 space-x-2">

                      <button
                        onClick={() =>
                          onEdit(income)
                        }
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(income._id)
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

