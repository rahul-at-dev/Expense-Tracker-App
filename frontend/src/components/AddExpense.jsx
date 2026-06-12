import { useState } from 'react'
import expenseService from '../services/expenseService'

export default function AddExpense({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    'Food',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Education',
    'Shopping',
    'Other',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (
      !formData.title ||
      !formData.amount ||
      !formData.category ||
      !formData.date
    ) {
      setError('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    setLoading(true)

    try {
      const result = await expenseService.createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
      })

      if (result.success) {
        onSuccess()
      }
    } catch (err) {
      setError(
        err.message || 'Failed to create expense'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chart-card p-8">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Add New Expense
        </h2>

        <p className="text-slate-500 mt-1">
          Record a new expense transaction.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Title */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Expense Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Grocery Shopping"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount + Category */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount
            </label>

            <div className="flex">
              <span className="inline-flex items-center px-4 bg-slate-100 border border-slate-300 rounded-l-xl text-slate-600 font-medium">
                ₹
              </span>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-l-0 border-slate-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Date */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Optional notes about this expense..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-slate-400"
          >
            {loading
              ? 'Adding Expense...'
              : 'Add Expense'}
          </button>

        </div>

      </form>
    </div>
  )
}