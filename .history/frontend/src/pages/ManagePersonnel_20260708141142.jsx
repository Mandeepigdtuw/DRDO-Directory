// src/pages/ManagePersonnel.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Loader2, Users } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { getAllPersonnel, deletePersonnel } from '../services/api'

export default function ManagePersonnel() {
  const [personnel, setPersonnel] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPersonnel()
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(personnel)
    } else {
      const q = search.toLowerCase()
      setFiltered(personnel.filter(p =>
        p.full_name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.designation.toLowerCase().includes(q) ||
        p.lab_acronym.toLowerCase().includes(q) ||
        p.employee_id.toLowerCase().includes(q)
      ))
    }
  }, [search, personnel])

  const fetchPersonnel = async () => {
    setLoading(true)
    try {
      const res = await getAllPersonnel()
      setPersonnel(res.data.personnel)
      setFiltered(res.data.personnel)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (employee_id) => {
    setDeletingId(employee_id)
    try {
      await deletePersonnel(employee_id)
      setPersonnel(prev => prev.filter(p => p.employee_id !== employee_id))
      setConfirmDelete(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout maxWidth="max-w-7xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Personnel</h1>
          <p className="text-slate-400 text-sm mt-1">
            {personnel.length} records in directory
          </p>
        </div>
        <Link
          to="/admin/personnel/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Personnel
        </Link>
      </div>

      {/* Search Filter */}
      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 gap-3 mb-6 max-w-md">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, department, lab..."
          className="bg-transparent text-white py-3 outline-none placeholder-slate-500 text-sm flex-1"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>No personnel found.</p>
        </div>
      ) : (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/80">
                  <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Employee ID</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Name</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Designation</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Department</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Lab</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Exp</th>
                  <th className="text-right text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((person, index) => (
                  <tr
                    key={person.employee_id}
                    className={'border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ' + (index % 2 === 0 ? 'bg-transparent' : 'bg-slate-800/20')}
                  >
                    <td className="px-4 py-3 text-blue-400 text-sm font-mono">
                      {person.employee_id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white text-sm font-medium">{person.full_name}</div>
                      <div className="text-slate-500 text-xs">{person.gender}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{person.designation}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{person.department}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                        {person.lab_acronym}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{person.years_of_experience} yrs</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate('/admin/personnel/edit/' + person.employee_id)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(person)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Confirm Delete</h3>
            <p className="text-slate-400 text-sm mb-1">
              Are you sure you want to delete:
            </p>
            <p className="text-white font-medium mb-5">
              {confirmDelete.full_name} ({confirmDelete.employee_id})
            </p>
            <p className="text-red-400 text-xs mb-5">
              This action cannot be undone. The record will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.employee_id)}
                disabled={deletingId === confirmDelete.employee_id}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {deletingId === confirmDelete.employee_id
                  ? <Loader2 size={15} className="animate-spin" />
                  : null}
                {deletingId === confirmDelete.employee_id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}