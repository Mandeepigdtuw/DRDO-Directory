// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
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
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-sky-950 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-slate-950/20 overflow-hidden lg:grid lg:grid-cols-[1.15fr_0.85fr]">

          <div className="relative overflow-hidden px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_28%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/20 border border-white/10 mb-6 shadow-sm shadow-slate-950/20">
                  <Shield size={28} className="text-sky-300" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">DRDO Admin Portal</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Secure internal access for personnel directory administration, analytics and safe operations.
                </p>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/20 p-6 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/80 text-sky-300">
                    <User size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Secure authentication</p>
                    <p className="text-xs text-slate-400">Only authorized personnel may access admin tools.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/80 text-sky-300">
                    <Lock size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Enterprise-grade security</p>
                    <p className="text-xs text-slate-400">Protects sensitive mission-critical directory data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80">DRDO Internal Access</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Sign in to continue</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Enter your admin credentials to access the personnel directory dashboard.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <label className="block text-sm font-medium text-slate-300">
                Username
                <div className="mt-2 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="admin username"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 pl-11 text-sm text-white shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-slate-300">
                Password
                <div className="mt-2 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 pl-11 pr-12 text-sm text-white shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-100"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                <span>{loading ? 'Verifying...' : 'Login to Admin Panel'}</span>
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Security Notice</p>
              <p className="mt-2 text-[0.95rem] leading-6 text-slate-400">
                This portal is for authorized DRDO personnel only. Unauthorized access is prohibited and monitored.
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-slate-500">
              <p>Defense Research and Development Organisation</p>
              <p className="mt-2">Protected internal access for mission-critical operations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}