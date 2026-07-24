// src/services/api.js
import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

// Create axios instance pointing to our backend
const api = axios.create({
  baseURL: BASE_URL,
})

// Automatically attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── AUTH ────────────────────────────────────────
export const loginAdmin = (username, password) =>
  api.post('/auth/login', { username, password })

// ─── SEARCH ──────────────────────────────────────
export const searchPersonnel = (query) =>
  api.get(`/search/?q=${encodeURIComponent(query)}`)


// ─── ADMIN PERSONNEL ─────────────────────────────
export const getAllPersonnel = () =>
  api.get('/admin/personnel')

export const getPersonById = (employee_id) =>
  api.get(`/admin/personnel/${employee_id}`)

export const addPersonnel = (data) =>
  api.post('/admin/personnel', data)

export const updatePersonnel = (employee_id, data) =>
  api.put(`/admin/personnel/${employee_id}`, data)

export const deletePersonnel = (employee_id) =>
  api.delete(`/admin/personnel/${employee_id}`)

// ─── ANALYTICS ───────────────────────────────────
export const getAnalyticsSummary = () =>
  api.get('/admin/analytics/summary')

export const getTopSearches = () =>
  api.get('/admin/analytics/top-searches')

export const getSearchTrends = () =>
  api.get('/admin/analytics/trends')

export const getDepartmentStats = () =>
  api.get('/admin/analytics/department-stats')

export const getZeroResults = () =>
  api.get('/admin/analytics/zero-results')

// Add this to the bottom of src/services/api.js
export const getAllPersonnelPublic = (sortBy = 'none', order = 'desc') =>
  api.get(`/search/all?sort_by=${sortBy}&order=${order}`)