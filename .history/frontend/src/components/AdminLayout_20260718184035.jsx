// src/components/AdminLayout.jsx
import Navbar from './Navbar'

export default function AdminLayout({ children, maxWidth = 'max-w-6xl' }) {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-sky-500/8 blur-3xl" />
      </div>
      <div className="relative z-10">
        <Navbar isAdmin={true} />
        <div className="w-full flex justify-center px-6 sm:px-10 lg:px-16 py-8">
          <div className={`${maxWidth} w-full`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}