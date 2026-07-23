// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { loginAdmin } from '../services/api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await loginAdmin(username, password)
      localStorage.setItem('admin_token', response.data.access_token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid username or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto w-full max-w-7xl grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
        <div className="hidden lg:flex flex-col justify-center rounded-[2rem] border border-slate-700 bg-slate-900/60 p-10 shadow-xl">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <Shield size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">DRDO Admin</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-md">
              Secure access to the personnel directory analytics, search, and management tools.
            </p>
          </div>
          <div className="space-y-4 text-slate-300">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.2em] mb-2">Why use this portal?</p>
              <ul className="space-y-3 text-sm leading-6">
                <li>• Manage personnel records across departments</li>
                <li>• Track search analytics and zero-result queries</li>
                <li>• Keep the directory accurate and discoverable</li>
              </ul>
            </div>
            <div className="grid gap-3 text-slate-200 text-sm">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4">
                <p className="font-semibold">Responsive design</p>
                <p className="text-slate-400">Works across desktops, tablets, and mobile screens.</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4">
                <p className="font-semibold">Full-width adaptable layout</p>
                <p className="text-slate-400">The page uses the available screen space fluidly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-4xl border border-slate-700 bg-slate-800/70 p-8 shadow-xl">

          <div className="text-center mb-8 lg:mb-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">
              DRDO Personnel Directory — Restricted Access
            </p>
          </div>

          <div className="space-y-6">

          {error && (
            <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-xl p-3 mb-5">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter admin username"
              className="w-full bg-slate-900 border border-slate-600 focus:border-blue-500 text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder-slate-500 text-sm"
            />
          </div>

          <div className="mb-6">
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                className="w-full bg-slate-900 border border-slate-600 focus:border-blue-500 text-white rounded-xl px-4 py-3 pr-11 outline-none transition-colors placeholder-slate-500 text-sm"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Verifying...' : 'Login to Admin Panel'}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Back to Directory Search
            </Link>
          </div>
        </div>

        <p className="text-slate-600 text-xs text-center mt-4 lg:col-span-2">
          Default: admin / drdo@admin123
        </p>
      </div>
    </div>
  )
}