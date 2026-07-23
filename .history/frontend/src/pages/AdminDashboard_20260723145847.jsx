// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Users, Search, BarChart2, AlertCircle, Plus, ArrowRight, Shield, Cpu, Database, Lock, Activity } from 'lucide-react'
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
    { label: 'Total Personnel', value: summary ? summary.total_personnel : '—', icon: Users, color: 'text-blue-400', border: 'border-blue-400/20', glow: 'bg-blue-400/10' },
    { label: 'Total Searches', value: summary ? summary.total_searches : '—', icon: Search, color: 'text-green-400', border: 'border-green-400/20', glow: 'bg-green-400/10' },
    { label: 'Searches Today', value: summary ? summary.searches_today : '—', icon: BarChart2, color: 'text-purple-400', border: 'border-purple-400/20', glow: 'bg-purple-400/10' },
    { label: 'Zero-Result', value: summary ? summary.zero_result_searches : '—', icon: AlertCircle, color: 'text-orange-400', border: 'border-orange-400/20', glow: 'bg-orange-400/10' },
  ]

  const quickLinks = [
    { title: 'Manage Personnel', description: 'View, edit, or delete existing records', to: '/admin/personnel', icon: Users, color: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Add New Personnel', description: 'Add a new scientist or staff member', to: '/admin/personnel/add', icon: Plus, color: 'text-green-400', iconBg: 'bg-green-500/10 border-green-500/20' },
    { title: 'Search Analytics', description: 'View search trends and top queries', to: '/admin/analytics', icon: BarChart2, color: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20' },
  ]

  const systemInfo = [
    { icon: Cpu, label: 'Search Engine', value: 'SBERT + FAISS', sub: 'all-MiniLM-L6-v2' },
    { icon: Database, label: 'Database', value: 'MongoDB Atlas', sub: 'Cloud Hosted' },
    { icon: Activity, label: 'Backend', value: 'Python FastAPI', sub: 'REST API' },
    { icon: Lock, label: 'Authentication', value: 'JWT Tokens', sub: 'Bearer Auth' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isAdmin={true} />

        {/* Sub-header */}
        <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
          <div style={{ padding: '20px 80px' }}>
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
        <div className="flex-1" style={{ padding: '32px 80px' }}>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className={`bg-slate-900 border ${stat.border} ${stat.glow} rounded-2xl p-6 shadow-lg`}>
                <div className={`mb-4 ${stat.color}`}>
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
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${link.iconBg}`}>
                    <link.icon size={22} className={link.color} />
                  </div>
                  <ArrowRight size={18} className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1">{link.title}</h3>
                <p className="text-slate-500 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>

          {/* Bottom Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* System Information */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-semibold text-base mb-5 pb-3 border-b border-slate-800">
                System Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {systemInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 bg-slate-950/60 rounded-xl p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-400/20 shrink-0 mt-0.5">
                      <item.icon size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">{item.label}</p>
                      <p className="text-white text-sm font-semibold">{item.value}</p>
                      <p className="text-slate-600 text-xs">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Directory Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-white font-semibold text-base mb-5 pb-3 border-b border-slate-800">
                Directory Summary
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Total Personnel Records', value: loading ? '...' : summary?.total_personnel ?? '—', color: 'text-blue-400' },
                  { label: 'Total Searches Made', value: loading ? '...' : summary?.total_searches ?? '—', color: 'text-green-400' },
                  { label: 'Searches Today', value: loading ? '...' : summary?.searches_today ?? '—', color: 'text-purple-400' },
                  { label: 'Zero-Result Searches', value: loading ? '...' : summary?.zero_result_searches ?? '—', color: 'text-orange-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-slate-800/80 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                      <span className="text-slate-400 text-sm">{item.label}</span>
                    </div>
                    <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
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