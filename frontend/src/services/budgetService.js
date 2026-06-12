import API from './api'

const budgetService = {
  createOrUpdate: async (data) => {
    try { const res = await API.post('/budgets', data); return res.data } catch (err) { throw err.response?.data || err }
  },
  update: async (id, data) => {
    try { const res = await API.put(`/budgets/${id}`, data); return res.data } catch (err) { throw err.response?.data || err }
  },
  getCurrent: async () => {
    try { const res = await API.get('/budgets/current'); return res.data } catch (err) { throw err.response?.data || err }
  },
  getMonth: async (month) => {
    try { const res = await API.get(`/budgets/${month}`); return res.data } catch (err) { throw err.response?.data || err }
  }
}

export default budgetService
