import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, maxWidth = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl border border-navy-700 bg-navy-900 p-6 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gold-500">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-navy-700 hover:text-gray-200">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
