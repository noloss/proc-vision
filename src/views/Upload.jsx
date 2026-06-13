import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { CATEGORIES, SAMPLE_FILES } from '../data'
import { useApp } from '../App'

const PROCESSING_MESSAGES = [
  'Extracting line items…',
  'Normalising units and currencies…',
  'Running quality checks…',
  'Matching to SpAC price list…',
]

export default function Upload() {
  const navigate = useNavigate()
  const { selectedCategories, uploadedCategories, setUploadedCategories } = useApp()
  const [subState, setSubState] = useState('form')
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [skipConfirm, setSkipConfirm] = useState(false)

  const selectedCats = CATEGORIES.filter(c => selectedCategories.includes(c.id))

  function markUploaded(id) {
    setUploadedCategories(prev => prev.includes(id) ? prev : [...prev, id])
  }

  function startProcessing() {
    setSubState('processing')
    setProgress(0)
    setMsgIndex(0)
  }

  useEffect(() => {
    if (subState !== 'processing') return
    const msgInterval = setInterval(() => setMsgIndex(i => (i + 1) % PROCESSING_MESSAGES.length), 700)
    const progressInterval = setInterval(() => {
      setProgress(p => p >= 100 ? 100 : p + 2)
    }, 50)
    const done = setTimeout(() => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
      setSubState('results')
    }, 2500)
    return () => { clearInterval(msgInterval); clearInterval(progressInterval); clearTimeout(done) }
  }, [subState])

  const canProcess = uploadedCategories.length >= 1

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F2F7' }}>
      <TopBar step="Step 2 of 3 · Upload documents" />

      {subState === 'processing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(10,18,60,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-2xl p-10 w-full max-w-md mx-4 text-center" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#EEF1FB' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B3DBF" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0D1840', marginBottom: '20px' }}>Reading your documents…</h2>
            <div style={{ width: '100%', backgroundColor: '#EEF1FB', borderRadius: '99px', height: '6px', marginBottom: '14px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#1B3DBF', borderRadius: '99px', transition: 'width 50ms linear' }} />
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', height: '20px' }}>{PROCESSING_MESSAGES[msgIndex]}</p>
          </div>
        </div>
      )}

      {subState === 'form' && (
        <div className="flex-1 max-w-2xl mx-auto w-full px-8 py-10 pb-28">
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            Cost analysis
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0D1840', marginBottom: '6px' }}>Upload your documents</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>
            Upload invoices for each category, or use sample data to see how SpAC analyses your spend.
          </p>
          <div className="flex flex-col gap-3">
            {selectedCats.map(cat => {
              const uploaded = uploadedCategories.includes(cat.id)
              const filename = SAMPLE_FILES[cat.id]
              return (
                <div key={cat.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '16px 20px', border: '1px solid #E2E5EF' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D1840' }}>{cat.label}</span>
                    </div>
                    {uploaded ? (
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '99px', backgroundColor: '#ECFDF5', color: '#059669' }}>
                        Uploaded ✓
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: 500, padding: '3px 10px', borderRadius: '99px', backgroundColor: '#F3F4F6', color: '#9CA3AF' }}>
                        Awaiting upload
                      </span>
                    )}
                  </div>
                  {uploaded ? (
                    <div className="flex items-center gap-2" style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E5EF' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{filename}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markUploaded(cat.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1B3DBF', color: '#FFFFFF', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Add invoices
                      </button>
                      <button
                        onClick={() => markUploaded(cat.id)}
                        style={{ fontSize: '12px', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', fontWeight: 500 }}
                      >
                        Use sample data →
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {subState === 'results' && (
        <div className="flex-1 max-w-2xl mx-auto w-full px-8 py-10 pb-28">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0D1840', marginBottom: '8px' }}>Processing complete</h2>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>15 line items extracted and matched automatically.</p>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>3 line items need your review.</p>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <Collapsible title="Matched automatically" count={15} defaultOpen={false}>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '10px' }}>15 items across Office supplies, IT hardware, Software &amp; licences</p>
              {['Office supplies — 9 items', 'IT hardware — 4 items', 'Software & licences — 2 items'].map(line => (
                <div key={line} className="flex items-center gap-2" style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1B3DBF', flexShrink: 0 }} />
                  {line}
                </div>
              ))}
            </Collapsible>

            <Collapsible title="Needs your review" count={3} defaultOpen={true} accent>
              <div className="flex flex-col gap-2">
                {[
                  { desc: 'Fellowes Apex Shredder Bags', issue: 'Extraction unclear — unit price may be wrong' },
                  { desc: 'Avery L7160 Address Labels', issue: 'Low confidence match (72%) — please confirm' },
                  { desc: 'Scotch Magic Tape 19mm 8-pack', issue: 'No SpAC equivalent found' },
                ].map(item => (
                  <div key={item.desc} style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '12px 14px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0D1840', marginBottom: '2px' }}>{item.desc}</p>
                    <p style={{ fontSize: '12px', color: '#D97706' }}>{item.issue}</p>
                  </div>
                ))}
              </div>
            </Collapsible>
          </div>

          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400E', marginBottom: '4px' }}>⚠ File too coarse to use</p>
            <p style={{ fontSize: '13px', color: '#92400E' }}>
              The file for Facilities &amp; cleaning ("facilities_q3_summary.pdf") contains no line-level detail. Ask your supplier for an itemised invoice.
            </p>
          </div>
        </div>
      )}

      {subState === 'form' && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E5EF' }}>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>{uploadedCategories.length} of {selectedCats.length} uploaded</span>
          <button
            onClick={startProcessing}
            disabled={!canProcess}
            style={{
              backgroundColor: canProcess ? '#1B3DBF' : '#E2E5EF',
              color: canProcess ? '#FFFFFF' : '#9CA3AF',
              border: 'none', borderRadius: '8px', padding: '10px 24px',
              fontSize: '14px', fontWeight: 600, cursor: canProcess ? 'pointer' : 'not-allowed',
            }}
          >
            Process documents →
          </button>
        </div>
      )}

      {subState === 'results' && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E5EF' }}>
          <div>
            {skipConfirm ? (
              <span style={{ fontSize: '13px', color: '#374151' }}>
                This may reduce accuracy. Confirm?{' '}
                <button onClick={() => navigate('/status')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#0D1840', textDecoration: 'underline', fontSize: '13px' }}>Yes</button>
                {' / '}
                <button onClick={() => setSkipConfirm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#0D1840', textDecoration: 'underline', fontSize: '13px' }}>Cancel</button>
              </span>
            ) : (
              <button onClick={() => setSkipConfirm(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#9CA3AF', textDecoration: 'underline' }}>
                Skip and submit anyway
              </button>
            )}
          </div>
          <button
            onClick={() => navigate('/review')}
            style={{ backgroundColor: '#1B3DBF', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Review 3 items →
          </button>
        </div>
      )}
    </div>
  )
}

function Collapsible({ title, count, defaultOpen, accent, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${accent ? '#FDE68A' : '#E2E5EF'}`, borderRadius: '10px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between"
        style={{ padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D1840' }}>{title}</span>
          <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: accent ? '#FEF3C7' : '#EEF1FB', color: accent ? '#92400E' : '#1B3DBF' }}>
            {count}
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}
