import { useEffect, useState } from 'react'
import incomeService from '../services/incomeService'

export default function EditIncome({
  income,
  onSuccess,
  onCancel
}) {
  const [form, setForm] = useState(income)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sources = [
    'Salary',
    'Business',
    'Interest',
    'Investment',
    'Gifts',
    'Other'
  ]

  useEffect(() => {
    setForm({
      ...income,
      date: new Date(income.date)
        .toISOString()
        .split('T')[0]
    })
  }, [income])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (
      !form.title ||
      !form.amount ||
      !form.source ||
      !form.date
    ) {
      setError('Please fill all required fields')
      return
    }

    if (parseFloat(form.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    setLoading(true)

    try {
      const res =
        await incomeService.updateIncome(
          income._id,
          {
            title: form.title,
            amount: parseFloat(form.amount),
            source: form.source,
            description: form.description,
            date: form.date
          }
        )

      if (res.success) {
        onSuccess()
      }
    } catch (err) {
      setError(
        err.message ||
          'Failed to update income'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chart-card p-8">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Edit Income
        </h2>

        <p className="text-slate-500 mt-1">
          Update your income details.
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
            Income Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Amount + Source */}

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
                value={form.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-l-0 border-slate-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source
            </label>

            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sources.map((s) => (
                <option
                  key={s}
                  value={s}
                >
                  {s}
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
            value={form.date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Optional notes..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition disabled:bg-slate-400"
          >
            {loading
              ? 'Updating Income...'
              : 'Update Income'}
          </button>

        </div>

      </form>

    </div>
  )
}
