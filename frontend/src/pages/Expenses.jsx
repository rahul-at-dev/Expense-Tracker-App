import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import AddExpense from '../components/AddExpense'
import EditExpense from '../components/EditExpense'
import ExpenseList from '../components/ExpenseList'

export default function Expenses() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddSuccess = () => {
    setShowAddForm(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditSuccess = () => {
    setEditingExpense(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Expenses</h1>
          <p className="text-slate-500 mt-2">
            Manage and track your spending.
          </p>
        </div>

        {!showAddForm && !editingExpense && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 text-white shadow-lg hover:bg-green-700 transition"
          >
            <FaPlus />
            Add Expense
          </button>
        )}
      </div>

      {showAddForm && (
        <AddExpense
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingExpense && (
        <EditExpense
          expense={editingExpense}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingExpense(null)}
        />
      )}

      <ExpenseList
        onEdit={(expense) => setEditingExpense(expense)}
        onRefresh={refreshTrigger}
      />
    </div>
  )
}