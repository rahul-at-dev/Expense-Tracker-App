// 

export default function BudgetProgress({ budgetInfo }) {
  if (!budgetInfo) {
    return (
      <div className="text-center py-8 text-slate-500">
        No budget set for this month.
      </div>
    )
  }

  const { budget, spent, remaining, usagePercent } = budgetInfo

  const amount = budget?.amount ?? 0
  const pct = usagePercent ?? 0

  const barColor =
    pct >= 100
      ? 'from-red-500 to-rose-600'
      : pct > 75
      ? 'from-yellow-400 to-orange-500'
      : 'from-emerald-500 to-green-600'

  return (
    <div className="space-y-5">

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-slate-50 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Monthly Budget
          </p>

          <h2 className="text-2xl font-bold mt-1">
            ₹{amount.toFixed(2)}
          </h2>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Spent
          </p>

          <h2 className="text-2xl font-bold text-red-500 mt-1">
            ₹{spent.toFixed(2)}
          </h2>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            {remaining >= 0 ? 'Remaining' : 'Exceeded'}
          </p>

          <h2
            className={`text-2xl font-bold mt-1 ${
              remaining >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            ₹{Math.abs(remaining).toFixed(2)}
          </h2>
        </div>

      </div>

      <div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Budget Usage</span>
          <span>{pct}%</span>
        </div>

        <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-5 bg-gradient-to-r ${barColor}`}
            style={{
              width: `${Math.min(100, pct)}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}