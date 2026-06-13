import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import CategoryIcon from '../components/CategoryIcon'
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F2F7' }}>
      <TopBar step="Step 1 of 3 · Select categories" />

      <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-10 pb-28">
        <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
          Cost analysis
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D1840', marginBottom: '6px' }}>
          Select spend categories
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '28px' }}>
          Choose the categories you want to include. You can add more later.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {CATEGORIES.map(cat => {
            const selected = selectedCategories.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  backgroundColor: selected ? '#F5F7FF' : '#FFFFFF',
                  border: selected ? '1.5px solid #1B3DBF' : '1.5px solid #E2E5EF',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  position: 'relative',
                  transition: 'border-color 0.1s, background-color 0.1s',
                }}
              >
                {selected && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', backgroundColor: '#1B3DBF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <span style={{ color: selected ? '#1B3DBF' : '#6B7280', flexShrink: 0 }}>
                  <CategoryIcon id={cat.id} size={20} />
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: selected ? '#1B3DBF' : '#0D1840', lineHeight: 1.3 }}>{cat.label}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{cat.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E5EF' }}>
        <span style={{ fontSize: '14px', color: '#6B7280' }}>
          {selectedCategories.length === 0
            ? 'No categories selected'
            : `${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'} selected`}
        </span>
        <button
          onClick={() => selectedCategories.length > 0 && navigate('/upload')}
          disabled={selectedCategories.length === 0}
          style={{
            backgroundColor: selectedCategories.length === 0 ? '#E2E5EF' : '#1B3DBF',
            color: selectedCategories.length === 0 ? '#9CA3AF' : '#FFFFFF',
            border: 'none', borderRadius: '8px', padding: '10px 24px',
            fontSize: '14px', fontWeight: 600,
            cursor: selectedCategories.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
