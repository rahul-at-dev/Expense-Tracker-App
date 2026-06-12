import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Layout({
  children,
  user,
  onLogout,
  onNavigate,
  currentView
}) {
  const [mobileMenu, setMobileMenu] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'budget', label: 'Budget' },
    { id: 'incomes', label: 'Incomes' },
    { id: 'reports', label: 'Reports' }
  ]

  const handleNavigate = (page) => {
    onNavigate(page)
    setMobileMenu(false)
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">

        <nav className="max-w-[1450px] mx-auto px-4 sm:px-6 py-4">

          <div className="flex justify-between items-center">

            <h1
              onClick={() => handleNavigate('dashboard')}
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent cursor-pointer"
            >
              Pocket Expense
            </h1>

            {user && (
              <>
                {/* Desktop Navigation */}

                <div className="hidden lg:flex items-center gap-8">

                  <ul className="flex gap-6">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavigate(item.id)}
                          className={`font-medium transition ${
                            currentView === item.id
                              ? 'text-blue-600'
                              : 'text-slate-600 hover:text-blue-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4 border-l pl-6">
                    <span className="text-slate-700 font-medium">
                      {user.name}
                    </span>

                    <button
                      onClick={onLogout}
                      className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>

                </div>

                {/* Mobile Menu Button */}

                <button
                  onClick={() =>
                    setMobileMenu(!mobileMenu)
                  }
                  className="lg:hidden text-slate-700 text-xl"
                >
                  {mobileMenu ? (
                    <FaTimes />
                  ) : (
                    <FaBars />
                  )}
                </button>
              </>
            )}

          </div>

          {/* Mobile Navigation */}

          {mobileMenu && user && (
            <div className="lg:hidden mt-4 border-t border-slate-200 pt-4">

              <div className="flex flex-col gap-2">

                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleNavigate(item.id)
                    }
                    className={`text-left px-4 py-3 rounded-xl transition ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="border-t pt-3 mt-2">

                  <div className="px-4 py-2 text-slate-600">
                    {user.name}
                  </div>

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 rounded-xl bg-red-500 text-white"
                  >
                    Logout
                  </button>

                </div>

              </div>

            </div>
          )}

        </nav>

      </header>

      {/* Main */}

      <main className="flex-1 w-full max-w-[1450px] mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {children}
      </main>

      {/* Footer */}

      <footer className="bg-slate-900 text-slate-400 mt-12">
        <div className="max-w-[1450px] mx-auto px-4 py-6 text-center text-sm">
          © 2026 Pocket Expense
        </div>
      </footer>

    </div>
  )
}