import { useState } from 'react'
import reportsService from '../services/reportsService'
import { toast } from '../components/Toast'

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename

  document.body.appendChild(a)
  a.click()
  a.remove()

  window.URL.revokeObjectURL(url)
}

export default function Reports() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [month, setMonth] = useState('')
  const [summary, setSummary] = useState(null)

  const params = {}

  if (start) params.start = start
  if (end) params.end = end

  const handleExportExpenses = async () => {
    try {
      const res =
        await reportsService.exportExpensesCSV(
          params
        )

      downloadBlob(
        res.data,
        `expenses_${start || 'all'}_${end || 'all'}.csv`
      )

      toast(
        'success',
        'Expenses CSV downloaded'
      )
    } catch (err) {
      toast(
        'error',
        'Failed to export expenses'
      )
    }
  }

  const handleExportIncomes = async () => {
    try {
      const res =
        await reportsService.exportIncomesCSV(
          params
        )

      downloadBlob(
        res.data,
        `incomes_${start || 'all'}_${end || 'all'}.csv`
      )

      toast(
        'success',
        'Incomes CSV downloaded'
      )
    } catch (err) {
      toast(
        'error',
        'Failed to export incomes'
      )
    }
  }

  const handlePreviewSummary = async () => {
    try {
      const res =
        await reportsService.getSummary(params)

      setSummary(res.data.data)
    } catch (err) {
      toast(
        'error',
        'Failed to fetch summary'
      )
    }
  }

  const handleExportPDF = async () => {
    try {
      const res =
        await reportsService.exportSummaryPDF(
          params
        )

      downloadBlob(
        res.data,
        'financial_summary.pdf'
      )

      toast(
        'success',
        'PDF downloaded'
      )
    } catch (err) {
      toast(
        'error',
        'Failed to generate PDF'
      )
    }
  }

  const handleMonthlyExpenses = async () => {
    if (!month) {
      toast('error', 'Select month')
      return
    }

    try {
      const res =
        await reportsService.monthlyExpenses(
          month
        )

      const data = res.data.data

      setSummary({
        month: data.month,
        totalExpenses: data.total,
        transactions: data.transactions
      })
    } catch (err) {
      toast(
        'error',
        'Failed to fetch monthly expenses'
      )
    }
  }

  const handleMonthlyIncomes = async () => {
    if (!month) {
      toast('error', 'Select month')
      return
    }

    try {
      const res =
        await reportsService.monthlyIncomes(
          month
        )

      const data = res.data.data

      setSummary({
        month: data.month,
        totalIncome: data.total,
        transactions: data.transactions
      })
    } catch (err) {
      toast(
        'error',
        'Failed to fetch monthly incomes'
      )
    }
  }

  const handleByCategory = async () => {
    try {
      const res =
        await reportsService.byCategory(
          params
        )

      setSummary({
        byCategory: res.data.data
      })
    } catch (err) {
      toast(
        'error',
        'Failed to fetch category report'
      )
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Financial Reports
        </h1>

        <p className="text-slate-500 mt-2">
          Generate CSV exports, PDF reports and
          analyze your financial data.
        </p>
      </div>

      {/* Date Range Reports */}

      <div className="chart-card p-6 md:p-8">

        <h2 className="text-xl font-semibold mb-6">
          Export Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Date
            </label>

            <input
              type="date"
              value={start}
              onChange={(e) =>
                setStart(e.target.value)
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              End Date
            </label>

            <input
              type="date"
              value={end}
              onChange={(e) =>
                setEnd(e.target.value)
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-6">

          <button
            onClick={handleExportExpenses}
            className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Export Expenses CSV
          </button>

          <button
            onClick={handleExportIncomes}
            className="w-full px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
          >
            Export Incomes CSV
          </button>

          <button
            onClick={handlePreviewSummary}
            className="w-full px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 transition"
          >
            Preview Summary
          </button>

          <button
            onClick={handleExportPDF}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-black transition"
          >
            Export PDF
          </button>

        </div>

      </div>

      {/* Monthly Reports */}

      <div className="chart-card p-6 md:p-8">

        <h2 className="text-xl font-semibold mb-6">
          Monthly Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Month
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">

            <button
              onClick={handleMonthlyExpenses}
              className="w-full px-4 py-3 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition"
            >
              Expenses
            </button>

            <button
              onClick={handleMonthlyIncomes}
              className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Incomes
            </button>

            <button
              onClick={handleByCategory}
              className="w-full px-4 py-3 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition"
            >
              Category
            </button>

          </div>

        </div>

      </div>

      {/* Preview */}

      <div className="chart-card p-6 md:p-8">

        <h2 className="text-xl font-semibold mb-6">
          Report Preview
        </h2>

        {summary ? (
          <div className="overflow-x-auto">

            <div className="bg-slate-50 p-6 rounded-2xl">
  <h3 className="text-lg font-semibold mb-4">
    Summary Data
  </h3>

  <p>
    Month: {summary.month}
  </p>

  <p>
    Total Expenses: ₹{summary.totalExpenses}
  </p>

  <p>
    Transactions: {summary.transactions?.length || 0}
  </p>
</div>

          </div>
        ) : (
          <div className="text-slate-500">
            No report generated yet.
            <br />
            Use any report action above to
            preview data.
          </div>
        )}

      </div>

    </div>
  )
}

