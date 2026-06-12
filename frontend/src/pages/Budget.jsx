import { useEffect, useState } from 'react'
import budgetService from '../services/budgetService'
import BudgetProgress from '../components/BudgetProgress'
import { toast } from '../components/Toast'

export default function BudgetPage() {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  useEffect(() => {
    load()
  }, [])

  const load = async (monthKey) => {
    try {
      setLoading(true)

      const res = monthKey
        ? await budgetService.getMonth(monthKey)
        : await budgetService.getCurrent()

      if (res.success) {
        setInfo(res.data)

        setAmount(
          res.data.budget?.amount ?? ''
        )

        setSelectedMonth(
          monthKey ||
            res.data?.budget?.month ||
            new Date().toISOString().slice(0, 7)
        )
      }
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError('')

    const parsed = parseFloat(amount)

    if (isNaN(parsed) || parsed < 0) {
      setError('Enter valid amount')
      return
    }

    try {
      const res =
        await budgetService.createOrUpdate({
          amount: parsed,
          month: selectedMonth
        })

      if (res.success) {
        toast('success', 'Budget saved')
        load(selectedMonth)
      }
    } catch (err) {
      toast(
        'error',
        err.message || 'Save failed'
      )
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Budget Planner
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your monthly spending limits and stay in control.
        </p>
      </div>

      {/* Budget Form */}

      <div className="chart-card p-5 md:p-8">

        <h2 className="text-xl font-semibold mb-6">
          Set Monthly Budget
        </h2>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Budget Amount
            </label>

            <div className="flex">

              <span className="inline-flex items-center px-4 bg-slate-100 border border-slate-300 rounded-l-xl text-slate-600">
                ₹
              </span>

              <input
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Enter budget"
                className="w-full border border-l-0 border-slate-300 rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Month
            </label>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 justify-end">

            <button
              onClick={handleSave}
              className="w-full px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Save Budget
            </button>

            <button
              onClick={() =>
                load(selectedMonth)
              }
              className="w-full px-5 py-3 bg-slate-200 rounded-xl hover:bg-slate-300 transition"
            >
              Load Month
            </button>

          </div>

        </div>

      </div>

      {/* Budget Overview */}

      <div className="chart-card p-5 md:p-8">

        <h2 className="text-xl font-semibold mb-6">
          Budget Overview
        </h2>

        {loading ? (
          <div className="text-slate-500">
            Loading...
          </div>
        ) : (
          <BudgetProgress
            budgetInfo={info}
          />
        )}

      </div>

    </div>
  )
}