// src/components/AdminLayout.jsx
import Navbar from './Navbar'

export default function AdminLayout({ children, maxWidth = 'max-w-6xl', fluid = false }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar isAdmin={true} />
      <div className={`w-full flex ${fluid ? 'justify-start' : 'justify-center'} px-4 sm:px-6 py-8 sm:py-10`}>
        <div className={fluid ? 'w-full' : `${maxWidth} w-full`}>
          {children}
        </div>
      </div>
    </div>
  )
}