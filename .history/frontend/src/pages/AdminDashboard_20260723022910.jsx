// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Users, Search, BarChart2, AlertCircle, Plus, ArrowRight, Shield } from 'lucide-react'
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
    { label: 'Total Personnel', value: summary ? summary.total_personnel : '—', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { label: 'Total Searches', value: summary ? summary.total_searches : '—', icon: Search, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
    { label: 'Searches Today', value: summary ? summary.searches_today : '—', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
    { label: 'Zero-Result Searches', value: summary ? summary.zero_result_searches : '—', icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  ]

  const quickLinks = [
    { title: 'Manage Personnel', description: 'View, edit, or delete existing records', to: '/admin/personnel', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Add New Personnel', description: 'Add a new scientist or staff member', to: '/admin/personnel/add', icon: Plus, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { title: 'Search Analytics', description: 'View search trends and top queries', to: '/admin/analytics', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isAdmin={true} />

        {/* Sub-header */}
        <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm shrink-0">
          <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-28 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 shrink-0">
                <Shield size={20} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm mt-0.5">Overview of the DRDO Personnel Directory system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 w-full px-8 sm:px-12 lg:px-20 xl:px-28 py-8">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className={'bg-slate-900 border rounded-2xl p-6 shadow-lg ' + stat.bg}>
                <div className={'mb-4 ' + stat.color}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading
                    ? <div className="w-12 h-7 bg-slate-800 rounded animate-pulse"></div>
                    : stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-5">
            <h2 className="text-white font-semibold text-lg mb-1">Quick Actions</h2>
            <p className="text-slate-500 text-sm">Navigate to key sections of the admin panel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all group block shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={'flex h-12 w-12 items-center justify-center rounded-xl border ' + link.bg}>
                    <link.icon size={22} className={link.color} />
                  </div>
                  <ArrowRight size={18} className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1">{link.title}</h3>
                <p className="text-slate-500 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-semibold mb-5">System Information</h3>
              <div className="space-y-0">
                {[
                  { label: 'Search Engine', value: 'SBERT + FAISS (all-MiniLM-L6-v2)' },
                  { label: 'Database', value: 'MongoDB Atlas' },
                  { label: 'Backend', value: 'Python FastAPI' },
                  { label: 'Authentication', value: 'JWT Bearer Token' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className="text-slate-200 text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-semibold mb-5">Directory Summary</h3>
              <div className="space-y-0">
                {[
                  { label: 'Total Personnel Records', value: loading ? '...' : summary?.total_personnel ?? '—' },
                  { label: 'Total Searches Made', value: loading ? '...' : summary?.total_searches ?? '—' },
                  { label: 'Searches Today', value: loading ? '...' : summary?.searches_today ?? '—' },
                  { label: 'Zero-Result Searches', value: loading ? '...' : summary?.zero_result_searches ?? '—' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className="text-blue-400 text-sm font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}