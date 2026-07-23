// src/pages/EditPersonnel.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, Plus, X } from 'lucide-react'
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

  const inputClass = "w-full bg-slate-900 border border-slate-600 focus:border-blue-500 text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder-slate-500 text-sm"
  const labelClass = "text-slate-300 text-sm font-medium block mb-2"

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={32} className="text-blue-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isAdmin={true} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Personnel</h1>
          <p className="text-blue-400 text-sm mt-1">{employee_id}</p>
        </div>

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-xl p-3 mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm rounded-xl p-3 mb-5">
            Updated successfully! Redirecting...
          </div>
        )}

        {form && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Designation</label>
                <select name="designation" value={form.designation} onChange={handleChange} className={inputClass}>
                  {['Scientist B', 'Scientist C', 'Scientist D', 'Scientist E',
                    'Scientist F', 'Scientist G', 'Scientist H', 'Director',
                    'Technician A', 'Technician B'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Years of Experience</label>
                <input name="years_of_experience" type="number" value={form.years_of_experience}
                  onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Department</label>
                <input name="department" value={form.department} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Lab Acronym</label>
                <input name="lab_acronym" value={form.lab_acronym} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Office Phone</label>
                <input name="phone_office" value={form.phone_office} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" value={form.email} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Expertise Tags */}
            <div>
              <label className={labelClass}>Area of Expertise</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag('area_of_expertise', expertiseInput, setExpertiseInput)}
                  placeholder="Add expertise and press Enter"
                  className={inputClass + ' flex-1'}
                />
                <button
                  onClick={() => addTag('area_of_expertise', expertiseInput, setExpertiseInput)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl text-sm transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.area_of_expertise.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full">
                    {tag}
                    <button onClick={() => removeTag('area_of_expertise', i)}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Tags */}
            <div>
              <label className={labelClass}>Projects Associated</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag('projects_associated', projectInput, setProjectInput)}
                  placeholder="Add project and press Enter"
                  className={inputClass + ' flex-1'}
                />
                <button
                  onClick={() => addTag('projects_associated', projectInput, setProjectInput)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl text-sm transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.projects_associated.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                    {tag}
                    <button onClick={() => removeTag('projects_associated', i)}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate('/admin/personnel')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}