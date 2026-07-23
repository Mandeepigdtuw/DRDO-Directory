// src/pages/AddPersonnel.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus, X, UserPlus, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { addPersonnel } from '../services/api'

const emptyForm = {
  employee_id: '',
  full_name: '',
  gender: '',
  designation: '',
  department: '',
  lab_acronym: '',
  area_of_expertise: [],
  projects_associated: [],
  phone_office: '',
  email: '',
  years_of_experience: '',
}

export default function AddPersonnel() {
  const [form, setForm] = useState(emptyForm)
  const [expertiseInput, setExpertiseInput] = useState('')
  const [projectInput, setProjectInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addTag = (field, value, setValue) => {
    if (!value.trim()) return
    setForm({ ...form, [field]: [...form[field], value.trim()] })
    setValue('')
  }

  const removeTag = (field, index) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) })
  }

  const handleSubmit = async () => {
    if (!form.employee_id || !form.full_name || !form.gender ||
        !form.designation || !form.department || !form.lab_acronym ||
        !form.phone_office || !form.email || !form.years_of_experience) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.area_of_expertise.length === 0) {
      setError('Please add at least one area of expertise.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await addPersonnel({
        ...form,
        years_of_experience: parseInt(form.years_of_experience)
      })
      setSuccess(true)
      setTimeout(() => navigate('/admin/personnel'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add personnel. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-slate-950/80 border border-white/10 hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white rounded-xl px-4 py-2.5 outline-none transition placeholder-slate-600 text-sm"
  const labelClass = "text-slate-300 text-sm font-medium block mb-1.5"
  const sectionClass = "bg-slate-900/60 border border-white/8 rounded-2xl p-6"

  return (
    <div className="min-h-screen bg-[#030712] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-sky-500/8 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar isAdmin={true} />

        {/* Page Header */}
        <div className="border-b border-white/8 bg-slate-950/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
              <span className="hover:text-slate-300 cursor-pointer transition"
                onClick={() => navigate('/admin/personnel')}>
                Personnel
              </span>
              <ChevronRight size={13} />
              <span className="text-blue-400">Add New</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <UserPlus size={20} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Add New Personnel</h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Fill in the details below. Embedding vector will be generated automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8">

          {/* Alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 text-red-300 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-400/20 text-green-300 text-sm rounded-xl px-4 py-3 mb-6">
              ✅ Personnel added successfully! Redirecting...
            </div>
          )}

          {/* Two column layout on large screens */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* LEFT — Main Form (takes 2/3 width) */}
            <div className="xl:col-span-2 space-y-5">

              {/* Basic Info */}
              <div className={sectionClass}>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-3 border-b border-white/8">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Employee ID *</label>
                    <input name="employee_id" value={form.employee_id}
                      onChange={handleChange} placeholder="e.g. DRDO-1081"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input name="full_name" value={form.full_name}
                      onChange={handleChange} placeholder="e.g. Dr. Arjun Sharma"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select name="gender" value={form.gender}
                      onChange={handleChange} className={inputClass}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Years of Experience *</label>
                    <input name="years_of_experience" type="number"
                      value={form.years_of_experience} onChange={handleChange}
                      placeholder="e.g. 10" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Organizational Info */}
              <div className={sectionClass}>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-3 border-b border-white/8">
                  Organizational Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Designation *</label>
                    <select name="designation" value={form.designation}
                      onChange={handleChange} className={inputClass}>
                      <option value="">Select designation</option>
                      {['Scientist B', 'Scientist C', 'Scientist D', 'Scientist E',
                        'Scientist F', 'Scientist G', 'Scientist H', 'Director',
                        'Technician A', 'Technician B'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Lab Acronym *</label>
                    <input name="lab_acronym" value={form.lab_acronym}
                      onChange={handleChange} placeholder="e.g. LRDE"
                      className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Department *</label>
                    <input name="department" value={form.department}
                      onChange={handleChange} placeholder="e.g. Electronics & Radar"
                      className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className={sectionClass}>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-3 border-b border-white/8">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Office Phone *</label>
                    <input name="phone_office" value={form.phone_office}
                      onChange={handleChange} placeholder="e.g. 080-25051001"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input name="email" type="email" value={form.email}
                      onChange={handleChange} placeholder="e.g. name@lab.drdo.in"
                      className={inputClass} />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT — Tags + Submit (takes 1/3 width) */}
            <div className="space-y-5">

              {/* Area of Expertise */}
              <div className={sectionClass}>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-3 border-b border-white/8">
                  Area of Expertise *
                </h2>
                <div className="flex gap-2 mb-3">
                  <input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addTag('area_of_expertise', expertiseInput, setExpertiseInput)
                    }}
                    placeholder="e.g. Radar Systems"
                    className={inputClass + ' flex-1'}
                  />
                  <button
                    onClick={() => addTag('area_of_expertise', expertiseInput, setExpertiseInput)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded-xl text-sm transition flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-8">
                  {form.area_of_expertise.length === 0 && (
                    <p className="text-slate-600 text-xs">No expertise added yet</p>
                  )}
                  {form.area_of_expertise.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full">
                      {tag}
                      <button onClick={() => removeTag('area_of_expertise', i)}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects Associated */}
              <div className={sectionClass}>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-3 border-b border-white/8">
                  Projects Associated
                </h2>
                <div className="flex gap-2 mb-3">
                  <input
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addTag('projects_associated', projectInput, setProjectInput)
                    }}
                    placeholder="e.g. Project ARUDHRA"
                    className={inputClass + ' flex-1'}
                  />
                  <button
                    onClick={() => addTag('projects_associated', projectInput, setProjectInput)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded-xl text-sm transition flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-8">
                  {form.projects_associated.length === 0 && (
                    <p className="text-slate-600 text-xs">No projects added yet</p>
                  )}
                  {form.projects_associated.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 border border-white/10 px-3 py-1 rounded-full">
                      {tag}
                      <button onClick={() => removeTag('projects_associated', i)}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-blue-500/30 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                  {loading ? 'Adding Personnel...' : 'Add Personnel'}
                </button>
                <button
                  onClick={() => navigate('/admin/personnel')}
                  className="w-full h-11 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-sm transition"
                >
                  Cancel
                </button>
              </div>

              {/* Info box */}
              <div className="rounded-xl border border-blue-400/10 bg-blue-500/5 p-4">
                <p className="text-xs font-semibold text-blue-400 mb-1">Auto Processing</p>
                <p className="text-xs text-slate-500 leading-5">
                  After submission, an NLP embedding vector will be automatically
                  generated for this record and the search index will be updated immediately.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}