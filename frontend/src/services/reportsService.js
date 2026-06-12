import API from './api'

const reportsService = {
  exportExpensesCSV: (params) => API.get('/reports/expenses/csv', { params, responseType: 'blob' }),
  exportIncomesCSV: (params) => API.get('/reports/incomes/csv', { params, responseType: 'blob' }),
  getSummary: (params) => API.get('/reports/summary', { params }),
  exportSummaryPDF: (params) => API.get('/reports/summary/pdf', { params, responseType: 'blob' }),
  monthlyExpenses: (month) => API.get('/reports/expenses/monthly', { params: { month } }),
  monthlyIncomes: (month) => API.get('/reports/incomes/monthly', { params: { month } }),
  byCategory: (params) => API.get('/reports/expenses/by-category', { params }),
}

export default reportsService
