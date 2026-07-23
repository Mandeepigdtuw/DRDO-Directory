// src/pages/AnalyticsDashboard.jsx
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { Search, TrendingUp, AlertCircle, Building2 } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import {
  getTopSearches,
  getSearchTrends,
  getDepartmentStats,
  getZeroResults,
  getAnalyticsSummary
} from '../services/api'

const COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6'
]

const SearchTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-sm shadow-xl">
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
      <div className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-sm shadow-xl">
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
      <div className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-sm shadow-xl">
        <p className="text-white font-medium">{payload[0].payload.department}</p>
        <p className="text-blue-400">{payload[0].value} staff</p>
      </div>
    )
  }
  return null
}

// Truncate long query labels for bar chart (responsive)
const truncateLabel = (label, maxLen = 18) => {
  if (!label) return ''
  return label.length > maxLen ? label.substring(0, maxLen - 2) + '...' : label
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null)
  const [topSearches, setTopSearches] = useState([])
  const [trends, setTrends] = useState([])
  const [deptStats, setDeptStats] = useState([])
  const [zeroResults, setZeroResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    // Track small screen for responsive chart sizing
    const mq = window.matchMedia('(max-width: 640px)')
    const handle = (e) => setIsSmall(e.matches)
    handle(mq)
    if (mq.addEventListener) mq.addEventListener('change', handle)
    else mq.addListener(handle)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handle)
      else mq.removeListener(handle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    {
      label: 'Total Searches',
      value: summary ? summary.total_searches : '—',
      icon: Search,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20'
    },
    {
      label: 'Searches Today',
      value: summary ? summary.searches_today : '—',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-400/10 border-green-400/20'
    },
    {
      label: 'Zero-Result Queries',
      value: summary ? summary.zero_result_searches : '—',
      icon: AlertCircle,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10 border-orange-400/20'
    },
    {
      label: 'Departments',
      value: deptStats.length || '—',
      icon: Building2,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/20'
    },
  ]

  if (loading) {
    return (
      <AdminLayout fluid>
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
    <AdminLayout fluid>

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

      {/* Row 1: Top Searches + Search Trends (3-col layout on large screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        {/* Top Searches Bar Chart */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 lg:col-span-2">
          <h2 className="text-white font-semibold mb-1">Top Searches</h2>
          <p className="text-slate-400 text-xs mb-4">Most frequently searched queries</p>
          {topSearches.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-slate-500 text-sm">
              No search data yet
            </div>
          ) : (
            <div className={"h-56 sm:h-64 md:h-64 lg:h-72"}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSearches.map(s => ({ ...s, shortQuery: truncateLabel(s.query, isSmall ? 12 : 18) }))}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortQuery"
                    tick={{ fill: '#94a3b8', fontSize: isSmall ? 9 : 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={isSmall ? 100 : 130}
                  />
                  <Tooltip
                    content={<SearchTooltip />}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Search Trends Line Chart */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1">Search Trends</h2>
          <p className="text-slate-400 text-xs mb-4">Daily search volume over last 30 days</p>
          {trends.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-slate-500 text-sm">
              No trend data yet
            </div>
          ) : (
            <div className={"h-56 sm:h-64 md:h-64 lg:h-72"}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trends}
                  margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#94a3b8', fontSize: isSmall ? 9 : 10 }}
                    axisLine={false}
                    tickLine={false}
                    angle={-35}
                    textAnchor="end"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: isSmall ? 9 : 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<TrendTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: isSmall ? 2 : 4, strokeWidth: 0 }}
                    activeDot={{ r: isSmall ? 4 : 6, fill: '#60a5fa' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Department Pie + Zero Results (3-col layout on large screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Department Pie Chart */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 lg:col-span-2">
          <h2 className="text-white font-semibold mb-1">Personnel by Department</h2>
          <p className="text-slate-400 text-xs mb-4">
            Distribution of staff across departments
          </p>
          {deptStats.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-slate-500 text-sm">
              No data available
            </div>
          ) : (
            <>
              <div className={"h-52 sm:h-60 md:h-56 lg:h-64"}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptStats}
                      dataKey="count"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={isSmall ? 60 : 85}
                      innerRadius={isSmall ? 28 : 35}
                      paddingAngle={2}
                      label={false}
                    >
                      {deptStats.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend below chart — no overlap */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                {deptStats.map((dept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-400 text-xs truncate">
                      {dept.department} ({dept.count})
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Zero Results Table */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1">Zero-Result Queries</h2>
          <p className="text-slate-400 text-xs mb-4">
            Searches that returned no results — consider adding relevant personnel
          </p>
          {zeroResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm gap-3">
              <AlertCircle size={36} className="opacity-20" />
              <p>No zero-result queries yet</p>
              <p className="text-xs text-slate-600">All searches are returning results</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {zeroResults.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-600 text-xs font-mono w-5 shrink-0">
                      {index + 1}
                    </span>
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

    </AdminLayout>
  )
}