import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

import AddIncome from '../components/AddIncome'
import EditIncome from '../components/EditIncome'
import IncomeList from '../components/IncomeList'

export default function IncomePage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [refresh, setRefresh] = useState(0)

  const onAddSuccess = () => {
    setShowAdd(false)
    setRefresh((r) => r + 1)
  }

  const onEditSuccess = () => {
    setEditing(null)
    setRefresh((r) => r + 1)
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold">
            Income
          </h1>

          <p className="text-slate-500 mt-2">
            Track and manage all your income sources.
          </p>
        </div>

        {!showAdd && !editing && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 text-white shadow-lg hover:bg-green-700 transition"
          >
            <FaPlus />
            Add Income
          </button>
        )}

      </div>

      {/* Add Form */}

      {showAdd && (
        <AddIncome
          onSuccess={onAddSuccess}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* Edit Form */}

      {editing && (
        <EditIncome
          income={editing}
          onSuccess={onEditSuccess}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Income Table */}

      <IncomeList
        onEdit={(income) => setEditing(income)}
        onRefresh={refresh}
      />

    </div>
  )
  }

