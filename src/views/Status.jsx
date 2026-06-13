import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { CATEGORIES } from '../data'
import { useApp } from '../App'

export default function Status() {
  const navigate = useNavigate()
  const { selectedCategories, setSelectedCategories, setUploadedCategories } = useApp()

  const submittedCats = CATEGORIES.filter(c => selectedCategories.includes(c.id) && c.id !== 'facilities')
  const facilitiesCat = CATEGORIES.find(c => c.id === 'facilities')
  const facilitiesSelected = selectedCategories.includes('facilities')

  function handleRestart() {
    setSelectedCategories([])
    setUploadedCategories([])
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F2F7' }}>
      <TopBar />

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div style={{ width: '100%', maxWidth: '640px' }}>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E5EF', padding: '40px', textAlign: 'center', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0D1840', marginBottom: '10px' }}>
              Your documents have been submitted
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>
              SpAC will complete the review and send a savings estimate within 2 business days.
              <br />We'll email <span style={{ fontWeight: 600, color: '#374151' }}>otto@hartmann.de</span> when it's ready.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E5EF', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF' }}>Submitted categories</p>
            </div>
            {submittedCats.map((cat, i) => (
              <div key={cat.id} className="flex items-center gap-4" style={{ padding: '14px 20px', borderBottom: i < submittedCats.length - 1 ? '1px solid #F3F4F6' : undefined }}>
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D1840' }}>{cat.label}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#EEF1FB', color: '#1B3DBF' }}>Under review</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Submitted 14 Jun 2026, 11:42</p>
                </div>
              </div>
            ))}
            {facilitiesSelected && facilitiesCat && (
              <div className="flex items-start gap-4" style={{ padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '20px' }}>{facilitiesCat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D1840' }}>{facilitiesCat.label}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#FEF3C7', color: '#92400E' }}>File issue</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>Upload an itemised invoice to include this category</p>
                  <button style={{ fontSize: '12px', color: '#1B3DBF', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>Upload new file ›</button>
                </div>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleRestart}
              style={{ fontSize: '13px', color: '#6B7280', background: 'none', border: '1px solid #E2E5EF', borderRadius: '8px', padding: '9px 20px', cursor: 'pointer', backgroundColor: '#FFFFFF' }}
            >
              ← Start a new analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
