import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import IncomePage from './pages/Income'
import BudgetPage from './pages/Budget'
import Reports from './pages/Reports'
import authService from './services/authService'
import './App.css'
import Toast, { toast } from './components/Toast'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [view, setView] = useState('login') // 'login', 'register', 'dashboard', 'expenses', 'incomes', 'budget'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setIsAuthenticated(true)
      setCurrentUser(JSON.parse(user))
      setView('dashboard')
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)
    setIsAuthenticated(true)
    setView('dashboard')
  }

  const handleRegisterSuccess = () => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)
    setIsAuthenticated(true)
    setView('dashboard')
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setView('login')
  }

  const switchView = (newView) => {
    if (!isAuthenticated && newView !== 'login' && newView !== 'register') {
      return
    }
    setView(newView)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <>
        {view === 'login' ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Register onRegisterSuccess={handleRegisterSuccess} />
        )}
        <div className="fixed bottom-4 left-4 text-sm text-gray-600">
          {view === 'login' ? (
            <button 
              onClick={() => switchView('register')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Need an account? Register
            </button>
          ) : (
            <button 
              onClick={() => switchView('login')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Already have an account? Login
            </button>
          )}
        </div>
      </>
    )
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout} onNavigate={switchView} currentView={view}>
      {view === 'dashboard' && <Dashboard />}
      {view === 'expenses' && <Expenses />}
      {view === 'incomes' && <IncomePage />}
      {view === 'budget' && <BudgetPage />}
      {view === 'reports' && <Reports />}
      <Toast />
    </Layout>
  )
}

export default App
