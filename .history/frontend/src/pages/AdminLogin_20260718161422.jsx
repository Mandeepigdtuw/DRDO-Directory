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
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      {/* ================================
          BACKGROUND EFFECTS
      ================================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Top-left blue glow */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />

        {/* Bottom-right blue glow */}
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

      </div>

      {/* ================================
          TOP NAVIGATION / BRANDING BAR
      ================================= */}

      <header className="relative z-10 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[90px] w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">

          {/* Left Branding */}
          <div className="flex items-center gap-4">

            {/* Logo */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 shadow-lg shadow-blue-500/10">

              <Shield
                size={30}
                className="text-blue-400"
              />

            </div>

            {/* Title */}
            <div>

              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">

                DRDO Personnel Directory

              </h1>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:text-sm">

                Government of India • Ministry of Defence

              </p>

            </div>

          </div>

          {/* Right Branding */}
          <div className="hidden text-right sm:block">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">

              Secure System

            </p>

            <p className="mt-1 text-xs text-slate-500">

              DESIDOC • DRDO

            </p>

          </div>

        </div>

      </header>

      {/* ================================
          MAIN LOGIN SECTION
      ================================= */}

      <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-start justify-center px-4 py-12 sm:px-6 sm:py-16 lg:py-20">

        <div className="w-full max-w-xl">

          {/* LOGIN CARD */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-10 lg:p-12">

            {/* Login Header */}
            <div className="mb-9 text-center">

              {/* Shield Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-500/10">

                <Shield
                  size={38}
                  className="text-blue-400"
                />

              </div>

              {/* Small Label */}
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">

                Restricted Access

              </p>

              {/* Main Heading */}
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">

                Administrator Login

              </h2>

              {/* Description */}
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">

                Sign in to access the DRDO personnel directory administration
                panel.

              </p>

            </div>

            {/* ERROR MESSAGE */}
            {error && (

              <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-red-200">

                <div className="flex items-start gap-3">

                  <span className="mt-0.5">
                    ⚠️
                  </span>

                  <p>
                    {error}
                  </p>

                </div>

              </div>

            )}

            {/* LOGIN FORM */}
            <div className="space-y-6">

              {/* USERNAME FIELD */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">

                  Username

                </label>

                <div className="group relative">

                  {/* Icon */}
                  <User
                    size={21}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-blue-400"
                  />

                  {/* Input */}
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="h-14 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 pl-12 text-base text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* PASSWORD FIELD */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">

                  Password

                </label>

                <div className="group relative">

                  {/* Lock Icon */}
                  <Lock
                    size={21}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-blue-400"
                  />

                  {/* Password Input */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-14 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 pl-12 pr-14 text-base text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                  />

                  {/* Show/Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={21} />
                    ) : (
                      <Eye size={21} />
                    )}

                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading && (

                  <Loader2
                    size={21}
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

            {/* SECURITY NOTICE */}
            <div className="mt-9 rounded-2xl border border-blue-400/10 bg-blue-500/5 p-5">

              <div className="flex items-start gap-4">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>

                  <p className="font-semibold text-slate-200">

                    Security Notice

                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">

                    This portal is intended exclusively for authorized
                    personnel. Unauthorized access is prohibited and may
                    be monitored.

                  </p>

                </div>

              </div>

            </div>

            {/* BACK TO DIRECTORY */}
            <Link
              to="/"
              className="mx-auto mt-8 flex w-fit items-center gap-2 text-sm text-slate-500 transition hover:text-blue-400"
            >

              <ArrowLeft size={16} />

              Back to Directory Search

            </Link>

          </div>

          {/* FOOTER */}
          <div className="mt-8 text-center">

            <p className="text-xs font-medium text-slate-500">

              Defence Research and Development Organisation

            </p>

            <p className="mt-2 text-[11px] text-slate-700">

              DESIDOC • Secure Internal Access • © 2026 DRDO

            </p>

          </div>

        </div>

      </main>

    </div>
  )
}