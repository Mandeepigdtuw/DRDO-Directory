// src/components/AdminLayout.jsx
import Navbar from './Navbar'

export default function AdminLayout({ children, maxWidth = 'max-w-6xl' }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isAdmin={true} />
      <div className="w-full flex justify-center px-6 py-10">
        <div className={`${maxWidth} w-full`}>
          {children}
        </div>
      </div>
    </div>
  )
}