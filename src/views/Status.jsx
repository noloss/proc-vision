import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { CATEGORIES } from '../data'
import { useApp } from '../App'

export default function Status() {
  const navigate = useNavigate()
  const { selectedCategories, setSelectedCategories, setUploadedCategories } = useApp()

  const facilitiesSelected = selectedCategories.includes('facilities')

  function handleRestart() {
    setSelectedCategories(['office', 'it', 'software', 'mobile'])
    setUploadedCategories([])
    navigate('/')
  }

  const submittedIds = selectedCategories.filter(id => id !== 'facilities')
  const submittedCats = CATEGORIES.filter(c => submittedIds.includes(c.id))
  const facilitiesCat = CATEGORIES.find(c => c.id === 'facilities')

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      <TopBar step="Submitted" />

      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full" style={{ maxWidth: '680px' }}>
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#ECFDF5' }}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#2FA37C" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#1F2A44' }}>Your documents have been submitted</h1>
            <p className="text-gray-500 text-sm">
              SpAC will complete the review and send a savings estimate within 2 business days.
            </p>
            <p className="text-gray-500 text-sm">
              We'll email <span className="font-medium text-gray-700">otto@hartmann.de</span> when it's ready.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {submittedCats.map(cat => (
              <div key={cat.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: '#1F2A44' }}>{cat.label}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ECFDF5', color: '#2FA37C' }}>Under review</span>
                  </div>
                  <p className="text-xs text-gray-400">Submitted 14 Jun 2026, 11:42</p>
                </div>
              </div>
            ))}

            {facilitiesSelected && facilitiesCat && (
              <div className="bg-white rounded-xl border border-amber-100 shadow-sm px-5 py-4 flex items-start gap-4">
                <span className="text-2xl">{facilitiesCat.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: '#1F2A44' }}>{facilitiesCat.label}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>File issue</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Upload an itemised invoice to include this category</p>
                  <button className="text-xs underline" style={{ color: '#1F2A44' }}>Upload new file ›</button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleRestart}
              className="text-sm px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← Start a new analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
