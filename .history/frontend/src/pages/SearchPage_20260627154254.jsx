// src/pages/SearchPage.jsx
import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import PersonnelCard from '../components/PersonnelCard'
import ProfileModal from '../components/ProfileModal'
import { searchPersonnel } from '../services/api'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setSearched(false)

    try {
      const response = await searchPersonnel(query)
      setResults(response.data.results)
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

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isAdmin={false} />

      {/* Hero Search Section */}
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-sm font-medium tracking-widest uppercase">
            Intelligent Personnel Search
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-3">
          DRDO Personnel Directory
        </h1>
        <p className="text-slate-400 text-center mb-10 max-w-lg">
          Search by name, expertise, department, project, or any description.
          Our NLP engine understands the meaning behind your query.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl flex gap-2">
          <div className="flex-1 flex items-center bg-slate-800 border border-slate-600 rounded-xl px-4 gap-3 focus-within:border-blue-500 transition-colors">
            <Search className="text-slate-400 shrink-0" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Try "radar expert" or "missile propulsion scientist"...'
              className="flex-1 bg-transparent text-white py-4 outline-none placeholder-slate-500 text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Example queries */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {['cyber security', 'UAV design', 'naval torpedo systems', 'signal processing LRDE'].map((hint) => (
            <button
              key={hint}
              onClick={() => { setQuery(hint); }}
              className="text-xs text-slate-400 hover:text-blue-400 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {error && (
          <div className="text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-center mb-6">
            {error}
          </div>
        )}

        {searched && (
          <p className="text-slate-400 text-sm mb-4">
            {results.length > 0
              ? `${results.length} results for "${query}" — ranked by relevance`
              : `No results found for "${query}"`}
          </p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="text-center py-16 text-slate-500">
            <Search size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No personnel found matching your query.</p>
            <p className="text-sm mt-2">Try different keywords or a broader description.</p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedPerson && (
        <ProfileModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  )
}