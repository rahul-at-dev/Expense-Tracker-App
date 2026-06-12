import API from './api'

const analyticsService = {
  getSummary: async () => {
    try { const res = await API.get('/analytics/summary'); return res.data } catch (err) { throw err.response?.data || err }
  },
  getRecent: async (limit = 10) => {
    try { const res = await API.get(`/analytics/recent?limit=${limit}`); return res.data } catch (err) { throw err.response?.data || err }
  },
  getCategoryExpenses: async () => {
    try { const res = await API.get('/analytics/expenses/by-category'); return res.data } catch (err) { throw err.response?.data || err }
  },
  getMonthly: async () => {
    try { const res = await API.get('/analytics/monthly'); return res.data } catch (err) { throw err.response?.data || err }
  }
}

export default analyticsService
