import API from './api'

const incomeService = {
  createIncome: async (data) => {
    try {
      const res = await API.post('/incomes', data)
      return res.data
    } catch (err) {
      throw err.response?.data || err
    }
  },
  getIncomes: async (source = 'all', search = '', startDate = '', endDate = '') => {
    try {
      const params = new URLSearchParams()
      if (source && source !== 'all') params.append('source', source)
      if (search) params.append('search', search)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      const url = `/incomes${params.toString() ? '?' + params.toString() : ''}`
      const res = await API.get(url)
      return res.data
    } catch (err) {
      throw err.response?.data || err
    }
  },
  getIncome: async (id) => {
    try { const res = await API.get(`/incomes/${id}`); return res.data } catch (err) { throw err.response?.data || err }
  },
  updateIncome: async (id, data) => {
    try { const res = await API.put(`/incomes/${id}`, data); return res.data } catch (err) { throw err.response?.data || err }
  },
  deleteIncome: async (id) => {
    try { const res = await API.delete(`/incomes/${id}`); return res.data } catch (err) { throw err.response?.data || err }
  },
  getSummary: async () => {
    try { const res = await API.get('/incomes/stats/summary'); return res.data } catch (err) { throw err.response?.data || err }
  }
}

export default incomeService
