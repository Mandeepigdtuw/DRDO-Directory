// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, LogOut, Users, BarChart2, Plus, Search } from 'lucide-react'

export default function Navbar({ isAdmin = false }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/')

  if (!isAdmin) {
    return (
      <nav className="w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="flex h-20 w-full items-center justify-between px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-500/10">
              <Shield size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-base font-bold text-white leading-tight">
                DRDO Personnel Directory
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Government of India • Ministry of Defence
              </p>
            </div>
          </div>
          <Link
            to="/admin/login"
            className="text-xs font-medium text-slate-400 hover:text-blue-400 transition border border-white/10 hover:border-blue-400/30 px-4 py-2 rounded-lg"
          >
            Admin Login
          </Link>
        </div>
      </nav>
    )
  }

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: Shield },
    { to: '/admin/personnel', label: 'Personnel', icon: Users },
    { to: '/admin/personnel/add', label: 'Add', icon: Plus },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  ]

  return (
    <nav className="w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between px-6 sm:px-10 lg:px-16">

        {/* Left — Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-500/10">
            <Shield size={18} className="text-blue-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">DRDO Admin</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Personnel Directory
            </p>
          </div>
        </div>

        {/* Center — Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <Search size={16} />
            <span className="hidden sm:block">Search</span>
          </Link>

          {navLinks.map((link) => {
            const active = isActive(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ' +
                  (active
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
                }
              >
                <link.icon size={16} />
                <span className="hidden sm:block">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right — Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/5 border border-transparent hover:border-red-400/20 transition shrink-0"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Logout</span>
        </button>

      </div>
    </nav>
  )
}