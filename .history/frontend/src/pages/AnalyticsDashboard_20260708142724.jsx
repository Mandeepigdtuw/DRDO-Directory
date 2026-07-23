// src/pages/AnalyticsDashboard.jsx
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { Search, TrendingUp, AlertCircle, Building2 } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import {
  getTopSearches,
  getSearchTrends,
  getDepartmentStats,
  getZeroResults,
  getAnalyticsSummary
} from '../services/api'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-sm">
        <p className="text-slate-300">{label}</p>
        <p className="text-blue-400 font-semibold">{payload[0].value} searches</p>
      </div>
    )
  }
  return null
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

  if (loading) {
    return (
      <AdminLayout maxWidth="max-w-6xl">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout maxWidth="max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Search Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">
          Insights into how the directory is being used
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className={'bg-slate-800/60 border rounded-xl p-5 ' + stat.bg}>
            <div className={'mb-3 ' + stat.color}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Top Searches + Search Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Top Searches Bar Chart */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1">Top Searches</h2>
          <p className="text-slate-400 text-xs mb-5">Most frequently searched queries</p>
          {topSearches.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
              No search data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topSearches} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="query" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Search Trends Line Chart */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1">Search Trends</h2>
          <p className="text-slate-400 text-xs mb-5">Daily search volume over last 30 days</p>
          {trends.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
              No trend data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trends} margin={{ left: 0, right: 10 }}>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 2: Department Pie Chart + Zero Results Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Department Distribution Pie Chart */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1">Personnel by Department</h2>
          <p className="text-slate-400 text-xs mb-4">Distribution of staff across departments</p>
          {deptStats.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={deptStats}
                  dataKey="count"
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ department, percent }) =>
                    percent > 0.05 ? department.split(' ')[0] : ''
                  }
                  labelLine={false}
                >
                  {deptStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [value + ' staff', props.payload.department]}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Zero Results Table */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1">Zero-Result Queries</h2>
          <p className="text-slate-400 text-xs mb-4">
            Searches that returned no results — consider adding relevant personnel
          </p>
          {zeroResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm gap-2">
              <AlertCircle size={32} className="opacity-30" />
              <p>No zero-result queries yet</p>
              <p className="text-xs text-slate-600">All searches are returning results</p>
            </div>
          ) : (
            <div className="space-y-2">
              {zeroResults.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs font-mono w-5">{index + 1}</span>
                    <span className="text-slate-300 text-sm">{item.query}</span>
                  </div>
                  <span className="text-orange-400 text-xs font-semibold bg-orange-400/10 px-2.5 py-1 rounded-full">
                    {item.count}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </AdminLayout>
  )
}