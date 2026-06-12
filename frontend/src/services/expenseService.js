import API from './api'

const expenseService = {
  // Create a new expense
  createExpense: async (expenseData) => {
    try {
      const response = await API.post('/expenses', expenseData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get all expenses with filters
  getExpenses: async (category = 'all', search = '', startDate = '', endDate = '') => {
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') params.append('category', category)
      if (search) params.append('search', search)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const url = `/expenses${params.toString() ? '?' + params.toString() : ''}`
      const response = await API.get(url)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single expense
  getExpense: async (id) => {
    try {
      const response = await API.get(`/expenses/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await API.put(`/expenses/${id}`, expenseData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete expense
  deleteExpense: async (id) => {
    try {
      const response = await API.delete(`/expenses/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get expense summary
  getSummary: async () => {
    try {
      const response = await API.get('/expenses/stats/summary')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default expenseService
