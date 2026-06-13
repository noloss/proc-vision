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

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E5EF', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {CATEGORIES.map((cat, i) => {
            const selected = selectedCategories.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 20px',
                  backgroundColor: selected ? '#F5F7FF' : '#FFFFFF',
                  borderLeft: selected ? '3px solid #1B3DBF' : '3px solid transparent',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: i < CATEGORIES.length - 1 ? '1px solid #F3F4F6' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = '#FAFAFA' }}
                onMouseLeave={e => { if (!selected) e.currentTarget.style.backgroundColor = '#FFFFFF' }}
              >
                <span style={{ color: selected ? '#1B3DBF' : '#6B7280', flexShrink: 0 }}>
                  <CategoryIcon id={cat.id} size={18} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: selected ? 600 : 500, color: selected ? '#1B3DBF' : '#0D1840' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>{cat.desc}</div>
                </div>
                {selected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3DBF" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
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
