import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { CATEGORIES } from '../data'
import CategoryIcon from '../components/CategoryIcon'
import { useApp } from '../App'

export default function Status() {
  const navigate = useNavigate()
  const { selectedCategories, uploadedCategories, setSelectedCategories, setUploadedCategories } = useApp()

  const allCats = CATEGORIES.filter(c => selectedCategories.includes(c.id))

  function getStatus(cat) {
    if (cat.id === 'facilities') return 'issue'
    if (uploadedCategories.includes(cat.id)) return 'submitted'
    return 'pending'
  }

  const submittedCount = allCats.filter(c => getStatus(c) === 'submitted').length

  function handleAddCategories() {
    navigate('/')
  }

  function handleNewAnalysis() {
    setSelectedCategories([])
    setUploadedCategories([])
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F2F7' }}>
      <TopBar />

      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div style={{ width: '100%', maxWidth: '640px' }}>

          <div className="flex items-start justify-between" style={{ marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Cost analysis</p>
              <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0D1840', marginBottom: '4px' }}>Hartmann &amp; Co</h1>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                {submittedCount} of {allCats.length} {allCats.length === 1 ? 'category' : 'categories'} submitted
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>Submitted</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E5EF', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '12px' }}>
            {allCats.map((cat, i) => {
              const status = getStatus(cat)
              return (
                <div key={cat.id} className="flex items-center gap-4" style={{ padding: '14px 20px', borderBottom: i < allCats.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ color: status === 'submitted' ? '#1B3DBF' : status === 'issue' ? '#D97706' : '#D1D5DB', flexShrink: 0 }}>
                    <CategoryIcon id={cat.id} size={18} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0D1840' }}>{cat.label}</span>
                    {status === 'issue' && (
                      <p style={{ fontSize: '12px', color: '#D97706', marginTop: '2px' }}>File too coarse — upload an itemised invoice</p>
                    )}
                    {status === 'pending' && (
                      <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Not uploaded</p>
                    )}
                    {status === 'submitted' && (
                      <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Submitted 14 Jun 2026, 11:42</p>
                    )}
                  </div>
                  <StatusDot status={status} />
                </div>
              )
            })}
          </div>

          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: '#92400E' }}>
              SpAC will complete the review and send a savings estimate within 2 business days. We'll email <span style={{ fontWeight: 600 }}>otto@hartmann.de</span> when it's ready.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddCategories}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', backgroundColor: '#1B3DBF', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add more categories
            </button>
            <button
              onClick={handleNewAnalysis}
              style={{ padding: '11px 20px', backgroundColor: '#FFFFFF', color: '#374151', border: '1px solid #E2E5EF', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
            >
              New analysis
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatusDot({ status }) {
  if (status === 'submitted') return (
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
  )
  if (status === 'issue') return (
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="3">
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
  )
  return (
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#F3F4F6', flexShrink: 0 }} />
  )
}
