// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  // Check if JWT token exists in browser storage
  const token = localStorage.getItem('admin_token')

  if (!token) {
    // Not logged in → send to login page
    return <Navigate to="/admin/login" replace />
  }

  // Logged in → render whatever admin page was requested
  // Outlet renders the child route (dashboard, personnel, analytics)
  return <Outlet />
}