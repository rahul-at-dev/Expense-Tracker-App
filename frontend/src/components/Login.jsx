import { useState } from 'react'
import authService from '../services/authService'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authService.login(email, password)

      if (result.success) {
        onLoginSuccess()
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100" />

      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-float" />

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl animate-float-slow" />

      {/* Card */}

      <div className="relative z-10 w-full max-w-md">

        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-6 sm:p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Pocket Expense
            </h1>

            <p className="mt-3 text-slate-600">
              Sign in to your account
            </p>

          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <a
              href="#register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign up here
            </a>
          </p>

        </div>

      </div>

    </div>
  )
}

