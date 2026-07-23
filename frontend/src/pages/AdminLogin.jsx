// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield, User, Lock, Eye, EyeOff,
  Loader2, ArrowLeft, CheckCircle2
} from 'lucide-react'
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
      setError('Invalid username or password. Please verify your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col overflow-hidden">

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="relative z-10 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-500/10">
              <Shield size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">DRDO Personnel Directory</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Government of India • Ministry of Defence
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Secure System</p>
            <p className="text-[11px] text-slate-500">DESIDOC • DRDO</p>
          </div>
        </div>
      </header>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1">

        {/* LEFT PANEL — hidden on mobile/tablet */}
        <div className="hidden lg:flex flex-col justify-center gap-12 w-1/2 xl:w-[55%] px-14 xl:px-24 py-16 border-r border-white/5">

          {/* Top text block */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-400">
                Admin Portal
              </span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold leading-snug text-white mb-5">
              DRDO Personnel<br />
              <span className="text-blue-400">Directory System</span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Centralized personnel management with NLP-powered semantic search.
              Manage scientist profiles, track expertise, and analyse search patterns.
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-4">
            {[
              {
                title: 'NLP Semantic Search',
                desc: 'SBERT-powered intelligent personnel discovery',
              },
              {
                title: 'Real-time Analytics',
                desc: 'Search trends, top queries and usage insights',
              },
              {
                title: 'Secure Access Control',
                desc: 'JWT authentication with role-based permissions',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-400/20">
                  <CheckCircle2 size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom footer text */}
          <p className="text-xs text-slate-700">
            Defence Research and Development Organisation<br />
            © 2026 DRDO • Secure Internal Access
          </p>

        </div>

        {/* RIGHT PANEL — Login Form */}
        <div className="flex flex-1 items-center justify-center px-5 sm:px-10 py-10">

          <div className="w-full max-w-md">

            {/* Card */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 sm:p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">

              {/* Card Header */}
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                  <Shield size={26} className="text-blue-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">
                  Restricted Access
                </p>
                <h2 className="text-2xl font-bold text-white">Administrator Login</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Sign in to access the administration panel.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <div className="flex items-start gap-2">
                    <span>⚠️</span>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your username"
                      autoComplete="username"
                      className="w-full h-11 rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full h-11 rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-blue-500/30 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>{loading ? 'Authenticating...' : 'Sign In Securely'}</span>
                </button>

              </div>

              {/* Security Notice */}
              <div className="mt-6 rounded-xl border border-blue-400/10 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Security Notice</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      This portal is intended exclusively for authorized personnel.
                      Unauthorized access is prohibited and may be monitored.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Link */}
              <Link
                to="/"
                className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-400 transition"
              >
                <ArrowLeft size={14} />
                Back to Directory Search
              </Link>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}