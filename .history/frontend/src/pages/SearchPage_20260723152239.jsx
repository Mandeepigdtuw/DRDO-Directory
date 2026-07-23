// src/pages/SearchPage.jsx
import { useState } from 'react'
import { Search, Loader2, Zap, Shield, Database } from 'lucide-react'
import Navbar from '../components/Navbar'
import PersonnelCard from '../components/PersonnelCard'
import ProfileModal from '../components/ProfileModal'
import { searchPersonnel, getAllPersonnelPublic } from '../services/api'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [error, setError] = useState('')

  const isExperienceQuery = (q) => {
    const lower = q.toLowerCase()
    return (
      lower.includes('maximum experience') ||
      lower.includes('most experience') ||
      lower.includes('most experienced') ||
      lower.includes('maximum years') ||
      lower.includes('highest experience') ||
      lower.includes('senior most') ||
      lower.includes('most senior') ||
      lower.includes('experienced scientist') ||
      lower.includes('experienced engineer')
    )
  }

  const isMinExperienceQuery = (q) => {
    const lower = q.toLowerCase()
    return (
      lower.includes('less than') ||
      lower.includes('fewer than') ||
      lower.includes('under') ||
      lower.includes('below') ||
      lower.includes('least experience') ||
      lower.includes('minimum experience') ||
      lower.includes('least experienced') ||
      lower.includes('junior') ||
      lower.includes('entry level') ||
      lower.includes('fresher') ||
      lower.includes('newest') ||
      lower.includes('youngest')
    )
  }

  const extractNumber = (q) => {
    const match = q.match(/\d+/)
    return match ? parseInt(match[0]) : null
  }

  const hasDomainContext = (q) => {
    const experienceWords = [
      'most', 'maximum', 'highest', 'senior', 'experienced',
      'scientist', 'engineer', 'in', 'the', 'field', 'of', 'with'
    ]
    const words = q.toLowerCase().split(' ')
    const domainWords = words.filter(w => w.length > 2 && !experienceWords.includes(w))
    return domainWords.length > 0
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setSearched(false)

    try {
      let data = []

      if (isMinExperienceQuery(query)) {
        const response = await getAllPersonnelPublic()
        let all = [...response.data.results]
        const num = extractNumber(query)
        if (num !== null) all = all.filter(p => p.years_of_experience < num)
        data = all.sort((a, b) => a.years_of_experience - b.years_of_experience)
          .map((p, i) => ({ ...p, relevance_score: Math.max(0.99 - i * 0.01, 0.1) }))

      } else if (isExperienceQuery(query) && hasDomainContext(query)) {
        const response = await searchPersonnel(query + '&top_k=30')
        data = [...response.data.results]
          .sort((a, b) => b.years_of_experience - a.years_of_experience)
          .slice(0, 10)
          .map((p, i) => ({ ...p, relevance_score: Math.max(0.99 - i * 0.02, 0.1) }))

      } else if (isExperienceQuery(query)) {
        const response = await getAllPersonnelPublic()
        data = [...response.data.results]
          .sort((a, b) => b.years_of_experience - a.years_of_experience)
          .map((p, i) => ({ ...p, relevance_score: Math.max(0.99 - i * 0.01, 0.1) }))

      } else {
        const response = await searchPersonnel(query)
        data = response.data.results
      }

      setResults(data)
      setSearched(true)
    } catch (err) {
      setError('Search failed. Please make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const hints = [
    'radar expert',
    'cyber security CAIR',
    'most experienced in aeronautics',
    'signal processing LRDE',
    'less than 5 years experience',
    'missile propulsion scientist',
  ]

  const features = [
    { icon: Zap, label: 'Semantic NLP Search', desc: 'Understands meaning, not just keywords' },
    { icon: Database, label: '80+ Personnel Records', desc: 'Across all DRDO departments' },
    { icon: Shield, label: 'Secure & Internal', desc: 'Restricted to authorized access' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-blue-900/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isAdmin={false} />

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-6 pt-24 pb-16">

          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-[0.25em]">
              Intelligent Personnel Search
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-4l lg:text-2l font-bold text-white text-center leading-tight mb-5">
            DRDO Personnel
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              Directory
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-center text-base sm:text-md max-w-xl leading-relaxed mb-10">
            Search by name, expertise, department, project, or any natural language description.
            Our NLP engine understands the meaning behind your query.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl flex gap-3 mb-6">
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 hover:border-slate-500 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 rounded-2xl px-5 gap-4 transition-xl">
              <Search className="text-slate-400 shrink-0" size={24} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Try "radar expert" or "missile scientist in Hyderabad"...'
                className="flex-1 bg-transparent text-white py-6 outline-none placeholder-slate-500 text-lg"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setResults([]); setSearched(false) }}
                  className="text-slate-500 hover:text-white transition text-2xl leading-none shrink-0"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/20 transition whitespace-nowrap"
            >
              {loading
                ? <Loader2 size={20} className="animate-spin" />
                : <Search size={18} />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Hint chips */}
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mb-12">
            {hints.map((hint) => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="text-sm text-slate-400 hover:text-blue-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/40 px-5 py-2.5 rounded-full transition-all"
              >
                {hint}
              </button>
            ))}
          </div>

          {/* Feature badges — shown only when no search done */}
          {!searched && (
            <div className="flex flex-wrap gap-4 justify-center">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <f.icon size={15} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{f.label}</p>
                    <p className="text-slate-500 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="flex-1 w-full flex flex-col items-center px-6 pb-16">
          <div className="w-full max-w-7xl">

            {error && (
              <div className="text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-center mb-6 text-sm">
                {error}
              </div>
            )}

            {searched && (
              <p className="text-slate-400 text-sm text-center mb-6">
                {results.length > 0
                  ? <span><span className="text-white font-semibold">{results.length}</span> results for <span className="text-blue-400">"{query}"</span> — ranked by relevance</span>
                  : <span>No results found for <span className="text-blue-400">"{query}"</span></span>
                }
              </p>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((person, index) => (
                  <PersonnelCard
                    key={person.employee_id}
                    person={person}
                    rank={index + 1}
                    onClick={() => setSelectedPerson(person)}
                  />
                ))}
              </div>
            )}

            {searched && results.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                  <Search size={52} className="mx-auto mb-5 opacity-20" />
                <p className="text-xl font-medium text-slate-400 mb-2">No personnel found</p>
                <p className="text-sm">Try different keywords or a broader description</p>
              </div>
            )}

          </div>
        </div>

      {selectedPerson && (
        <ProfileModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
  </div>
  )
}