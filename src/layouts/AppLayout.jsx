import React, { useMemo } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function AppLayout() {
  const { pathname } = useLocation()
  const { user, role, logout } = useAuth()

  const links = useMemo(() => {
    if (role === 'ADMIN') {
      return [
        { to: '/app/admin/dashboard', label: 'Dashboard' },
        { to: '/app/admin/users', label: 'Users' },
        { to: '/app/admin/stores', label: 'Stores' },
        { to: '/app/stores', label: 'Browse Stores' },
        { to: '/app/account/change-password', label: 'Account' },
      ]
    }
    if (role === 'OWNER') {
      return [
        { to: '/app/owner/dashboard', label: 'Dashboard' },
        { to: '/app/account/change-password', label: 'Account' },
      ]
    }
    // USER
    return [
      { to: '/app/stores', label: 'Stores' },
      { to: '/app/account/change-password', label: 'Account' },
    ]
  }, [role])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link 
            to={role === 'OWNER' ? '/app/owner/dashboard' : '/app/stores'} 
            className="text-lg font-semibold text-indigo-600"
          >
            RateMyStore
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
            <nav className="flex items-center gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded px-2 py-1 transition hover:bg-slate-100 ${
                      isActive ? 'text-indigo-600' : 'text-slate-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                {role || '—'}
              </span>
              <span className="max-w-[140px] truncate">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout

