// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      const token = response.data.access_token

      // Save token to localStorage
      localStorage.setItem('admin_token', token)

      // Redirect to admin dashboard
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">
            DRDO Personnel Directory — Restricted Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">

          {/* Error Message */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-xl p-3 mb-5">
              {error}
            </div>
          )}

          {/* Username */}
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

          {/* Password */}
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

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Verifying...</>
              : 'Login to Admin Panel'
            }
          </button>

          {/* Back to search */}
          <div className="text-center mt-4">
            
              href="/"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              ← Back to Directory Search
            </a>
          </div>
        </div>

        {/* Credentials hint for development */}
        <p className="text-slate-600 text-xs text-center mt-4">
          Default: admin / drdo@admin123
        </p>
      </div>
    </div>
  )
}