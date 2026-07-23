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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white flex flex-col">

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-60 -top-60 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-900/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/10 bg-slate-950/75 backdrop-blur-xl shrink-0">
        <div className="flex min-h-[72px] w-full items-center justify-between px-4 sm:px-8 lg:px-16 xl:px-24">

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10">
              <Shield size={24} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                DRDO Personnel Directory
              </h1>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-slate-500">
                Government of India • Ministry of Defence
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Secure System
            </p>
            <p className="mt-0.5 text-xs text-slate-500">DESIDOC • DRDO</p>
          </div>

        </div>
      </header>

      {/* Main Content — Two Column on large screens */}
      <main className="relative z-10 flex flex-1 w-full">

        {/* Left Panel — visible only on lg+ */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[50%] border-r border-white/5 bg-slate-950/40 px-12 xl:px-20 py-16">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 mb-10">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                Admin Portal
              </span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-6">
              DRDO Personnel<br />
              <span className="text-blue-400">Directory System</span>
            </h2>

            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Centralized personnel management with NLP-powered semantic search.
              Manage scientist profiles, track expertise, and analyse search patterns.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { title: 'NLP Semantic Search', desc: 'SBERT-powered intelligent personnel discovery' },
              { title: 'Real-time Analytics', desc: 'Search trends, top queries and usage insights' },
              { title: 'Secure Access Control', desc: 'JWT authentication with role-based permissions' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-400/20">
                  <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-slate-600">
              Defence Research and Development Organisation<br />
              © 2026 DRDO • Secure Internal Access
            </p>
          </div>

        </div>

        {/* Right Panel — Login Form */}
        <div className="flex flex-1 items-center justify-center px-4 sm:px-8 py-12">

          <div className="w-full max-w-md xl:max-w-lg">

            {/* Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 sm:p-10 shadow-2xl shadow-black/50 backdrop-blur-2xl">

              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-500/10">
                  <Shield size={30} className="text-blue-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
                  Restricted Access
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Administrator Login
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Sign in to access the personnel directory administration panel.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5">⚠️</span>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="space-y-5">

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Username
                  </label>
                  <div className="relative group">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-blue-400"
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your username"
                      autoComplete="username"
                      className="h-13 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 pl-11 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-blue-400"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-13 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  <span>{loading ? 'Authenticating...' : 'Sign In Securely'}</span>
                </button>

              </div>

              {/* Security Notice */}
              <div className="mt-7 rounded-2xl border border-blue-400/10 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-400" />
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
                className="mx-auto mt-7 flex w-fit items-center gap-2 text-sm text-slate-500 transition hover:text-blue-400"
              >
                <ArrowLeft size={15} />
                Back to Directory Search
              </Link>

            </div>

            {/* Footer — shown only on small screens where left panel is hidden */}
            <div className="mt-6 text-center lg:hidden">
              <p className="text-xs text-slate-600">
                Defence Research and Development Organisation • © 2026 DRDO
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}