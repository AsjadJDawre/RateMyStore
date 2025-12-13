import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">404</h1>
        <p className="mt-2 text-sm text-slate-600">Page not found.</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

export default NotFound




