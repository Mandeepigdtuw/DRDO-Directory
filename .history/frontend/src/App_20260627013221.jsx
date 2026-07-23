// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ManagePersonnel from './pages/ManagePersonnel'
import AddPersonnel from './pages/AddPersonnel'
import EditPersonnel from './pages/EditPersonnel'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Side - Public */}
        <Route path="/" element={<SearchPage />} />

        {/* Admin Login - Public */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Side - Protected (need JWT token) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="personnel" element={<ManagePersonnel />} />
          <Route path="personnel/add" element={<AddPersonnel />} />
          <Route path="personnel/edit/:employee_id" element={<EditPersonnel />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>

        {/* Catch all unknown URLs → redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}