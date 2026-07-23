// src/pages/AdminLogin.jsx

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Building2,
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

      localStorage.setItem(
        'admin_token',
        response.data.access_token
      )

      navigate('/admin/dashboard')
    } catch (err) {
      setError(
        'Invalid username or password. Please verify your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top Left Glow */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        {/* Bottom Right Glow */}
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl" />

        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">

        {/* Main Card */}
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:grid-cols-2">

          {/* =====================================================
              LEFT PANEL
          ====================================================== */}

          <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 md:p-10 lg:border-b-0 lg:border-r lg:p-12">

            {/* Decorative Gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-sky-500/10" />

            {/* Left Content */}
            <div className="relative flex flex-col gap-8">

              {/* Branding and Heading */}
              <div>

                {/* Government Branding */}
                <div className="mb-6 flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 shadow-lg shadow-blue-500/10">

                    <Shield
                      size={28}
                      className="text-blue-400"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                      Government of India
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      Ministry of Defence
                    </p>

                  </div>

                </div>

                {/* Main Heading */}
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">

                  DRDO Personnel

                  <span className="block text-blue-400">
                    Directory System
                  </span>

                </h1>

                {/* Description */}
                <p className="mt-5 max-w-md text-sm leading-6 text-slate-400 sm:text-base">

                  A secure administrative platform for managing personnel
                  information, directory records, and system analytics.

                </p>

              </div>

              {/* Security Feature Cards */}
              <div className="space-y-4">

                {/* Feature 1 */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm sm:p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                      <CheckCircle2 size={20} />

                    </div>

                    <div>

                      <h3 className="font-semibold text-white">
                        Secure Authentication
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">

                        Access is restricted to authorized administrative
                        personnel.

                      </p>

                    </div>

                  </div>

                </div>

                {/* Feature 2 */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm sm:p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">

                      <Building2 size={20} />

                    </div>

                    <div>

                      <h3 className="font-semibold text-white">
                        Centralized Directory Management
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">

                        Manage personnel information through a centralized
                        administrative interface.

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT PANEL - LOGIN FORM
          ====================================================== */}

          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">

            {/* Mobile Logo */}
            <div className="mb-7 flex justify-center lg:hidden">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10">

                <Shield
                  size={28}
                  className="text-blue-400"
                />

              </div>

            </div>

            {/* Header */}
            <div className="mb-8 text-center">

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">

                Restricted Access

              </p>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">

                Administrator Login

              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">

                Sign in to access the DRDO personnel directory administration
                panel.

              </p>

            </div>

            {/* Error Message */}
            {error && (

              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">

                <span className="mt-0.5">
                  ⚠️
                </span>

                <p>
                  {error}
                </p>

              </div>

            )}

            {/* Form */}
            <div className="space-y-5">

              {/* Username */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">

                  Username

                </label>

                <div className="group relative">

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
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3.5 pl-11 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400/70 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">

                  Password

                </label>

                <div className="group relative">

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
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400/70 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                <span>

                  {loading
                    ? 'Authenticating...'
                    : 'Sign In Securely'}

                </span>

              </button>

            </div>

            {/* Security Notice */}
            <div className="mt-8 rounded-2xl border border-blue-400/10 bg-blue-500/5 p-4">

              <div className="flex items-start gap-3">

                <Shield
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>

                  <p className="text-sm font-semibold text-slate-200">

                    Security Notice

                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">

                    This portal is intended exclusively for authorized
                    personnel. Unauthorized access is prohibited and may
                    be monitored.

                  </p>

                </div>

              </div>

            </div>

            {/* Back Link */}
            <Link
              to="/"
              className="mx-auto mt-7 flex items-center gap-2 text-sm text-slate-500 transition hover:text-blue-400"
            >

              <ArrowLeft size={15} />

              Back to Directory Search

            </Link>

            {/* Footer */}
            <div className="mt-8 border-t border-white/10 pt-5 text-center">

              <p className="text-xs font-medium text-slate-400">

                Defence Research and Development Organisation

              </p>

              <p className="mt-2 text-[11px] text-slate-600">

                DESIDOC • Secure Internal Access

              </p>

              <p className="mt-1 text-[11px] text-slate-700">

                © 2026 DRDO

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}