// src/pages/AddPersonnel.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus, X } from 'lucide-react'
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

  const inputClass = "w-full bg-slate-900 border border-slate-600 focus:border-blue-500 text-white rounded-xl px-4 py-3 outline-none transition-colors placeholder-slate-500 text-sm"
  const labelClass = "text-slate-300 text-sm font-medium block mb-2"

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isAdmin={true} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Add New Personnel</h1>
          <p className="text-slate-400 text-sm mt-1">
            Fill in the details below. Embedding will be generated automatically.
          </p>
        </div>

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-xl p-3 mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm rounded-xl p-3 mb-5">
            Personnel added successfully! Redirecting...
          </div>
        )}

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-5">

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Employee ID *</label>
              <input name="employee_id" value={form.employee_id} onChange={handleChange}
                placeholder="e.g. DRDO-1081" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Full Name *</label>
              <input name="full_name" value={form.full_name} onChange={handleChange}
                placeholder="e.g. Dr. Arjun Sharma" className={inputClass} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className={inputClass}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Years of Experience *</label>
              <input name="years_of_experience" type="number" value={form.years_of_experience}
                onChange={handleChange} placeholder="e.g. 10" className={inputClass} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Designation *</label>
              <select name="designation" value={form.designation} onChange={handleChange}
                className={inputClass}>
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
              <input name="lab_acronym" value={form.lab_acronym} onChange={handleChange}
                placeholder="e.g. LRDE" className={inputClass} />
            </div>
          </div>

          {/* Row 4 */}
          <div>
            <label className={labelClass}>Department *</label>
            <input name="department" value={form.department} onChange={handleChange}
              placeholder="e.g. Electronics & Radar" className={inputClass} />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Office Phone *</label>
              <input name="phone_office" value={form.phone_office} onChange={handleChange}
                placeholder="e.g. 080-25051001" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="e.g. name@lab.drdo.in" className={inputClass} />
            </div>
          </div>

          {/* Area of Expertise */}
          <div>
            <label className={labelClass}>Area of Expertise *</label>
            <div className="flex gap-2 mb-2">
              <input
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag('area_of_expertise', expertiseInput, setExpertiseInput)}
                placeholder="Type and press Enter or click Add"
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

          {/* Projects Associated */}
          <div>
            <label className={labelClass}>Projects Associated</label>
            <div className="flex gap-2 mb-2">
              <input
                value={projectInput}
                onChange={(e) => setProjectInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag('projects_associated', projectInput, setProjectInput)}
                placeholder="Type and press Enter or click Add"
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