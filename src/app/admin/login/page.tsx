'use client'
import { useActionState } from 'react'
import { login } from '../actions'

export default function AdminLogin() {
  const [error, formAction, pending] = useActionState(login, null)

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 bg-card border rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-60"
          >
            {pending ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
