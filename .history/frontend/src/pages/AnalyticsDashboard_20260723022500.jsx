// src/pages/AnalyticsDashboard.jsx
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { Search, TrendingUp, AlertCircle, Building2, BarChart2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import {
  getTopSearches, getSearchTrends,
  getDepartmentStats, getZeroResults, getAnalyticsSummary
} from '../services/api'

const COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6'
]

const SearchTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm shadow-xl">
        <p className="text-slate-300 mb-1">{label}</p>
        <p className="text-blue-400 font-semibold">{payload[0].value} searches</p>
      </div>
    )
  }
  return null
}

const TrendTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-blue-400 font-semibold">{payload[0].value} searches</p>
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm shadow-xl">
        <p className="text-white font-medium">{payload[0].payload.department}</p>
        <p className="text-blue-400">{payload[0].value} staff</p>
      </div>
    )
  }
  return null
}

const truncateLabel = (label) => {
  if (!label) return ''
  return label.length > 20 ? label.substring(0, 18) + '...' : label
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null)
  const [topSearches, setTopSearches] = useState([])
  const [trends, setTrends] = useState([])
  const [deptStats, setDeptStats] = useState([])
  const [zeroResults, setZeroResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, topRes, trendsRes, deptRes, zeroRes] = await Promise.all([
          getAnalyticsSummary(),
          getTopSearches(),
          getSearchTrends(),
          getDepartmentStats(),
          getZeroResults(),
        ])
        setSummary(summaryRes.data)
        setTopSearches(topRes.data.top_searches)
        setTrends(trendsRes.data.trends)
        setDeptStats(deptRes.data.department_stats)
        setZeroResults(zeroRes.data.zero_result_queries)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const statCards = [
    { label: 'Total Searches', value: summary?.total_searches ?? '—', icon: Search, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { label: 'Searches Today', value: summary?.searches_today ?? '—', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
    { label: 'Zero-Result Queries', value: summary?.zero_result_searches ?? '—', icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
    { label: 'Departments', value: deptStats.length || '—', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  ]

  const cardClass = "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar isAdmin={true} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isAdmin={true} />

        {/* Page Sub-header */}
        <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm shrink-0">
          <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-28 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 shrink-0">
                <BarChart2 size={20} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Search Analytics</h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Insights into how the directory is being used
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 w-full px-8 sm:px-12 lg:px-20 xl:px-28 py-8">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className={'bg-slate-900 border rounded-2xl p-6 shadow-lg ' + stat.bg}>
                <div className={'mb-4 ' + stat.color}>
                  <stat.icon size={22} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Row 1: Top Searches (2/3) + Trends (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Top Searches */}
            <div className={cardClass + ' lg:col-span-2'}>
              <h2 className="text-white font-semibold mb-1">Top Searches</h2>
              <p className="text-slate-400 text-xs mb-5">Most frequently searched queries</p>
              {topSearches.length === 0 ? (
                <div className="flex items-center justify-center h-52 text-slate-500 text-sm">No search data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={topSearches.map(s => ({ ...s, shortQuery: truncateLabel(s.query) }))}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                  >
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="shortQuery" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                    <Tooltip content={<SearchTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Search Trends */}
            <div className={cardClass}>
              <h2 className="text-white font-semibold mb-1">Search Trends</h2>
              <p className="text-slate-400 text-xs mb-5">Daily volume — last 30 days</p>
              {trends.length === 0 ? (
                <div className="flex items-center justify-center h-52 text-slate-500 text-sm">No trend data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trends} margin={{ top: 5, right: 15, left: 0, bottom: 25 }}>
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} angle={-40} textAnchor="end" interval="preserveStartEnd" />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<TrendTooltip />} />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#60a5fa' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Row 2: Department (2/3) + Zero Results (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Department Pie */}
            <div className={cardClass + ' lg:col-span-2'}>
              <h2 className="text-white font-semibold mb-1">Personnel by Department</h2>
              <p className="text-slate-400 text-xs mb-4">Distribution of staff across departments</p>
              {deptStats.length === 0 ? (
                <div className="flex items-center justify-center h-52 text-slate-500 text-sm">No data available</div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="w-full lg:w-64 shrink-0">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={deptStats} dataKey="count" nameKey="department" cx="50%" cy="50%" outerRadius={90} innerRadius={40} paddingAngle={2} label={false}>
                          {deptStats.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {deptStats.map((dept, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-400 text-xs truncate flex-1">{dept.department}</span>
                        <span className="text-slate-300 text-xs font-semibold shrink-0">{dept.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Zero Results */}
            <div className={cardClass}>
              <h2 className="text-white font-semibold mb-1">Zero-Result Queries</h2>
              <p className="text-slate-400 text-xs mb-4">
                Searches with no results — consider adding relevant personnel
              </p>
              {zeroResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm gap-3">
                  <AlertCircle size={36} className="opacity-20" />
                  <p>No zero-result queries yet</p>
                  <p className="text-xs text-slate-600">All searches returning results</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {zeroResults.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-950/60 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-slate-600 text-xs font-mono w-4 shrink-0">{index + 1}</span>
                        <span className="text-slate-300 text-sm truncate">{item.query}</span>
                      </div>
                      <span className="text-orange-400 text-xs font-semibold bg-orange-400/10 px-2.5 py-1 rounded-full shrink-0 ml-2">
                        {item.count}x
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}