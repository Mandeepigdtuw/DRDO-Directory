// src/components/ProfileModal.jsx
import { X, Phone, Mail, Building2, Award, Briefcase, FolderOpen, User } from 'lucide-react'

export default function ProfileModal({ person, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <User size={26} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{person.full_name}</h2>
              <p className="text-blue-400 text-sm">{person.employee_id}</p>
              <p className="text-slate-400 text-sm">{person.gender}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors mt-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Designation & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Award size={14} className="text-blue-400" />
                <span className="text-slate-400 text-xs uppercase tracking-wider">Designation</span>
              </div>
              <p className="text-white font-medium">{person.designation}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={14} className="text-blue-400" />
                <span className="text-slate-400 text-xs uppercase tracking-wider">Lab</span>
              </div>
              <p className="text-white font-medium">{person.lab_acronym}</p>
            </div>
          </div>

          {/* Department */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={14} className="text-blue-400" />
              <span className="text-slate-400 text-xs uppercase tracking-wider">Department</span>
            </div>
            <p className="text-white">{person.department}</p>
          </div>

          {/* Experience */}
          <div className="bg-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Years of Experience</span>
            <p className="text-white font-medium mt-1">{person.years_of_experience} years</p>
          </div>

          {/* Expertise */}
          <div className="bg-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs uppercase tracking-wider block mb-3">
              Area of Expertise
            </span>
            <div className="flex flex-wrap gap-2">
              {person.area_of_expertise.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen size={14} className="text-blue-400" />
              <span className="text-slate-400 text-xs uppercase tracking-wider">
                Associated Projects
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {person.projects_associated.map((proj) => (
                <span
                  key={proj}
                  className="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full"
                >
                  {proj}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Contact</span>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone size={16} className="text-blue-400 shrink-0" />
              <span>{person.phone_office}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Mail size={16} className="text-blue-400 shrink-0" />
              <span className="break-all">{person.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}