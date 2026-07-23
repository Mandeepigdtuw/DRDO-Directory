// src/components/PersonnelCard.jsx
import { Phone, Mail, Briefcase, Award } from 'lucide-react'

export default function PersonnelCard({ person, rank, onClick }) {
  const scorePercent = Math.round(person.relevance_score * 100)

  const scoreColor =
    scorePercent >= 60 ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    scorePercent >= 40 ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
    'text-slate-400 bg-slate-700/50 border-slate-600'

  return (
    <div
      onClick={onClick}
      className="w-full bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-800 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
            {rank}
          </div>
          <div>
            <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors leading-tight">
              {person.full_name}
            </h3>
            <p className="text-blue-400 text-xs mt-0.5">{person.employee_id}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ml-2 ${scoreColor}`}>
          {scorePercent}% match
        </span>
      </div>

      {/* Designation & Department */}
      <div className="flex items-center gap-2 mb-1.5">
        <Award size={13} className="text-slate-400 shrink-0" />
        <span className="text-slate-300 text-sm">{person.designation}</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400 text-sm truncate">{person.department}</span>
      </div>

      {/* Lab & Experience */}
      <div className="flex items-center gap-2 mb-3">
        <Briefcase size={13} className="text-slate-400 shrink-0" />
        <span className="text-slate-400 text-sm">
          {person.lab_acronym} · {person.years_of_experience} yrs experience
        </span>
      </div>

      {/* Expertise Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {person.area_of_expertise.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
        {person.area_of_expertise.length > 3 && (
          <span className="text-xs text-slate-500 px-1 py-0.5">
            +{person.area_of_expertise.length - 3} more
          </span>
        )}
      </div>

      {/* Contact */}
      <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-700 pt-3 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Phone size={11} /> {person.phone_office}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <Mail size={11} /> {person.email}
        </span>
      </div>
    </div>
  )
}