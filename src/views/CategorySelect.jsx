import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { CATEGORIES } from '../data'
import { useApp } from '../App'

export default function CategorySelect() {
  const navigate = useNavigate()
  const { selectedCategories, setSelectedCategories } = useApp()

  function toggle(id) {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  function handleContinue() {
    if (selectedCategories.length > 0) navigate('/upload')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      <TopBar step="Step 1 of 3 · Select categories" />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 pb-28">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#1F2A44' }}>Select spend categories</h1>
        <p className="text-gray-500 text-sm mb-6">Choose the categories you want to include in this cost analysis.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => {
            const selected = selectedCategories.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className="relative text-left rounded-xl p-4 transition-all focus:outline-none"
                style={{
                  backgroundColor: selected ? '#E6F4EF' : '#EDF3F9',
                  border: selected ? '2px solid #2FA37C' : '2px solid transparent',
                  boxShadow: selected ? '0 0 0 0px #2FA37C' : undefined,
                }}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#2FA37C' }}>
                    ✓
                  </div>
                )}
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: '#1F2A44' }}>{cat.label}</div>
                <div className="text-xs text-gray-500">{cat.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
        </span>
        <button
          onClick={handleContinue}
          disabled={selectedCategories.length === 0}
          className="px-6 py-2 rounded-lg text-white font-semibold text-sm transition-opacity"
          style={{
            backgroundColor: selectedCategories.length === 0 ? '#9CA3AF' : '#2FA37C',
            cursor: selectedCategories.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
