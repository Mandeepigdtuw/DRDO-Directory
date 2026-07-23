// src/pages/EditPersonnel.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, Plus, X, Pencil, ChevronRight, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getPersonById, updatePersonnel } from '../services/api'

export default function EditPersonnel() {
  const { employee_id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [expertiseInput, setExpertiseInput] = useState('')
  const [projectInput, setProjectInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getPersonById(employee_id)
      .then(res => setForm(res.data))
      .catch(() => setError('Failed to load personnel record.'))
      .finally(() => setFetching(false))
  }, [employee_id])

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
    setLoading(true)
    setError('')
    try {
      await updatePersonnel(employee_id, {
        ...form,
        years_of_experience: parseInt(form.years_of_experience)
      })
      setSuccess(true)
      setTimeout(() => navigate('/admin/personnel'), 1500)
    } catch (err) {
      setError('Failed to update. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-slate-950 border border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white rounded-xl px-4 py-2.5 outline-none transition placeholder-slate-600 text-sm"
  const labelClass = "text-slate-300 text-sm font-medium block mb-1.5"
  const sectionClass = "bg-slate-900/80 border border-slate-700 rounded-2xl p-6 shadow-lg"

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading record...</p>
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
            <div className="flex items-center gap-2 text-xs mb-3">
              <span
                className="text-slate-500 hover:text-slate-300 cursor-pointer transition"
                onClick={() => navigate('/admin/personnel')}
              >
                Personnel
              </span>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-slate-500">{employee_id}</span>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-blue-400">Edit</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 shrink-0">
                <Pencil size={18} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Edit Personnel</h1>
                <p className="text-blue-400 text-sm font-mono mt-0.5">{employee_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 w-full px-8 sm:px-12 lg:px-20 xl:px-28 py-8">

          {/* Alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 text-red-300 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
              <span className="shrink-0">⚠️</span>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-400/20 text-green-300 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <p>Updated successfully! Redirecting...</p>
            </div>
          )}

          {form && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* LEFT: Main Form — 2/3 */}
              <div className="xl:col-span-2 space-y-5">

                {/* Basic Information */}
                <div className={sectionClass}>
                  <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-5 pb-3 border-b border-slate-800">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input name="full_name" value={form.full_name}
                        onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Gender</label>
                      <select name="gender" value={form.gender}
                        onChange={handleChange} className={inputClass}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Designation</label>
                      <select name="designation" value={form.designation}
                        onChange={handleChange} className={inputClass}>
                        {['Scientist B', 'Scientist C', 'Scientist D', 'Scientist E',
                          'Scientist F', 'Scientist G', 'Scientist H', 'Director',
                          'Technician A', 'Technician B'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Years of Experience</label>
                      <input name="years_of_experience" type="number"
                        value={form.years_of_experience}
                        onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Organizational Details */}
                <div className={sectionClass}>
                  <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-5 pb-3 border-b border-slate-800">
                    Organizational Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Department</label>
                      <input name="department" value={form.department}
                        onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Lab Acronym</label>
                      <input name="lab_acronym" value={form.lab_acronym}
                        onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className={sectionClass}>
                  <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-5 pb-3 border-b border-slate-800">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Office Phone</label>
                      <input name="phone_office" value={form.phone_office}
                        onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input name="email" value={form.email}
                        onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT: Tags + Actions — 1/3 */}
              <div className="space-y-5">

                {/* Area of Expertise */}
                <div className={sectionClass}>
                  <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-5 pb-3 border-b border-slate-800">
                    Area of Expertise
                  </h2>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addTag('area_of_expertise', expertiseInput, setExpertiseInput)
                      }}
                      placeholder="Add expertise..."
                      className={inputClass + ' flex-1'}
                    />
                    <button
                      onClick={() => addTag('area_of_expertise', expertiseInput, setExpertiseInput)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded-xl transition flex items-center justify-center shrink-0"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-8">
                    {form.area_of_expertise.length === 0 && (
                      <p className="text-slate-600 text-xs italic">No expertise added</p>
                    )}
                    {form.area_of_expertise.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full">
                        {tag}
                        <button onClick={() => removeTag('area_of_expertise', i)} className="hover:text-white transition">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects Associated */}
                <div className={sectionClass}>
                  <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-5 pb-3 border-b border-slate-800">
                    Projects Associated
                  </h2>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={projectInput}
                      onChange={(e) => setProjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addTag('projects_associated', projectInput, setProjectInput)
                      }}
                      placeholder="Add project..."
                      className={inputClass + ' flex-1'}
                    />
                    <button
                      onClick={() => addTag('projects_associated', projectInput, setProjectInput)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded-xl transition flex items-center justify-center shrink-0"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-8">
                    {form.projects_associated.length === 0 && (
                      <p className="text-slate-600 text-xs italic">No projects added</p>
                    )}
                    {form.projects_associated.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full">
                        {tag}
                        <button onClick={() => removeTag('projects_associated', i)} className="hover:text-white transition">
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
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => navigate('/admin/personnel')}
                    className="w-full h-11 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm transition"
                  >
                    Cancel
                  </button>
                </div>

                {/* Notice */}
                <div className="rounded-xl border border-blue-400/15 bg-blue-500/5 p-4">
                  <p className="text-xs font-semibold text-blue-400 mb-1.5">Auto Processing</p>
                  <p className="text-xs text-slate-500 leading-5">
                    Saving changes will automatically regenerate the embedding vector
                    and update the FAISS search index immediately.
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}