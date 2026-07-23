// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Users, Search, BarChart2, AlertCircle, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAnalyticsSummary } from '../services/api'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalyticsSummary()
      .then(res => setSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    {
      label: 'Total Personnel',
      value: summary?.total_personnel ?? '—',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20',
    },
    {
      label: 'Total Searches',
      value: summary?.total_searches ?? '—',
      icon: Search,
      color: 'text-green-400',
      bg: 'bg-green-400/10 border-green-400/20',
    },
    {
      label: 'Searches Today',
      value: summary?.searches_today ?? '—',
      icon: BarChart2,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/20',
    },
    {
      label: 'Zero-Result Searches',
      value: summary?.zero_result_searches ?? '—',
      icon: AlertCircle,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10 border-orange-400/20',
    },
  ]

  const quickLinks = [
    {
      title: 'Manage Personnel',
      description: 'View, edit, or delete existing records',
      to: '/admin/personnel',
      icon: Users,
    },
    {
      title: 'Add New Personnel',
      description: 'Add a new scientist or staff member',
      to: '/admin/personnel/add',
      icon: Plus,
    },
    {
      title: 'Search Analytics',
      description: 'View search trends and top queries',
      to: '/admin/analytics',
      icon: BarChart2,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isAdmin={true} />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview of the DRDO Personnel Directory system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-slate-800/60 border rounded-xl p-5 ${stat.bg}`}
            >
              <div className={`mb-3 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {loading ? (
                  <div className="w-12 h-6 bg-slate-700 rounded animate-pulse" />
                ) : stat.value}
              </div>
              <div className="text-slate-400 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 rounded-xl p-5 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
                  <link.icon size={18} className="text-blue-400" />
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-600 group-hover:text-blue-400 transition-colors"
                />
              </div>
              <h3 className="text-white font-medium mb-1">{link.title}</h3>
              <p className="text-slate-400 text-sm">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}