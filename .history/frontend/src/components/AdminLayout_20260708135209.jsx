// src/components/AdminLayout.jsx
import Navbar from './Navbar'

export default function AdminLayout({ children, maxWidth = 'max-w-6xl' }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isAdmin={true} />
      <div className={`${maxWidth} mx-auto px-6 py-10 w-full`}>
        {children}
      </div>
    </div>
  )
}