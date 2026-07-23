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
    location.pathname === path
      ? 'bg-blue-600 text-white'
      : 'text-slate-300 hover:text-white hover:bg-slate-700'

  if (!isAdmin) {
    // Simple navbar for user search page
    return (
      <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-400" size={24} />
          <span className="text-white font-bold text-lg tracking-wide">
            DRDO Personnel Directory
          </span>
        </div>
        <Link
          to="/admin/login"
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          Admin Login
        </Link>
      </nav>
    )
  }

  // Full navbar for admin pages
  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="text-blue-400" size={22} />
        <span className="text-white font-bold tracking-wide">DRDO Admin</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/')}`}
        >
          <Search size={15} /> Search
        </Link>
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/dashboard')}`}
        >
          <Shield size={15} /> Dashboard
        </Link>
        <Link
          to="/admin/personnel"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/personnel')}`}
        >
          <Users size={15} /> Personnel
        </Link>
        <Link
          to="/admin/personnel/add"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/personnel/add')}`}
        >
          <Plus size={15} /> Add
        </Link>
        <Link
          to="/admin/analytics"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/analytics')}`}
        >
          <BarChart2 size={15} /> Analytics
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors"
      >
        <LogOut size={16} /> Logout
      </button>
    </nav>
  )
}