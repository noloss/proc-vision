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
    const msgInterval = setInterval(() => {
      setMsgIndex(i => (i + 1) % PROCESSING_MESSAGES.length)
    }, 700)
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return p + 2
      })
    }, 50)
    const done = setTimeout(() => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
      setSubState('results')
    }, 2500)
    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
      clearTimeout(done)
    }
  }, [subState])

  const canProcess = uploadedCategories.length >= 1

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      <TopBar step="Step 2 of 3 · Upload documents" />

      {subState === 'processing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl p-10 w-full max-w-md mx-4 text-center shadow-2xl">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-lg font-semibold mb-6" style={{ color: '#1F2A44' }}>Reading your documents…</h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${progress}%`, backgroundColor: '#2FA37C' }}
              />
            </div>
            <p className="text-sm text-gray-500 h-5">{PROCESSING_MESSAGES[msgIndex]}</p>
          </div>
        </div>
      )}

      {subState === 'form' && (
        <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 pb-28">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1F2A44' }}>Upload your documents</h1>
          <p className="text-gray-500 text-sm mb-6">Upload invoices or use sample data to see how SpAC analyses your spend.</p>
          <div className="flex flex-col gap-4">
            {selectedCats.map(cat => {
              const uploaded = uploadedCategories.includes(cat.id)
              const filename = SAMPLE_FILES[cat.id]
              return (
                <div key={cat.id} className="rounded-xl p-4" style={{ backgroundColor: '#EDF3F9' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-semibold text-sm" style={{ color: '#1F2A44' }}>{cat.label}</span>
                    </div>
                    {uploaded ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ECFDF5', color: '#2FA37C' }}>Uploaded ✓</span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Awaiting upload</span>
                    )}
                  </div>
                  {uploaded ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200">
                      <span className="text-sm">📄</span>
                      <span className="text-sm text-gray-700 font-medium">{filename}</span>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 text-center"
                      style={{ cursor: 'default' }}
                    >
                      <p className="text-sm text-gray-400 mb-1">Drop file here or <span className="text-gray-400">browse</span></p>
                      <p className="text-xs text-gray-300">PDF, Excel, Word</p>
                    </div>
                  )}
                  {!uploaded && (
                    <button
                      onClick={() => markUploaded(cat.id)}
                      className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                      Use sample data →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {subState === 'results' && (
        <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 pb-28">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ECFDF5' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2FA37C" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1F2A44' }}>Processing complete</h2>
            <p className="text-gray-600 text-sm">15 line items extracted and matched automatically.</p>
            <p className="text-gray-600 text-sm">3 line items need your review.</p>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <Collapsible title="Matched automatically" count={15} defaultOpen={false}>
              <p className="text-sm text-gray-500 mb-2">15 items across Office supplies, IT hardware, Software &amp; licences</p>
              <div className="flex flex-col gap-1">
                {['Office supplies — 9 items', 'IT hardware — 4 items', 'Software & licences — 2 items'].map(line => (
                  <div key={line} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#2FA37C' }} />
                    {line}
                  </div>
                ))}
              </div>
            </Collapsible>

            <Collapsible title="Needs your review" count={3} defaultOpen={true} accent>
              <div className="flex flex-col gap-2">
                {[
                  { desc: 'Fellowes Apex Shredder Bags', issue: 'Extraction unclear — unit price may be wrong', cat: 'Office supplies' },
                  { desc: 'Avery L7160 Address Labels', issue: 'Low confidence match (72%) — please confirm', cat: 'Office supplies' },
                  { desc: 'Scotch Magic Tape 19mm 8-pack', issue: 'No SpAC equivalent found', cat: 'Office supplies' },
                ].map(item => (
                  <div key={item.desc} className="bg-white rounded-lg p-3 border border-amber-100">
                    <p className="font-medium text-sm" style={{ color: '#1F2A44' }}>{item.desc}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#F59E0B' }}>{item.issue}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.cat}</p>
                  </div>
                ))}
              </div>
            </Collapsible>
          </div>

          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#92400E' }}>⚠ File too coarse to use</p>
            <p className="text-sm" style={{ color: '#92400E' }}>
              The file for Facilities &amp; cleaning ("facilities_q3_summary.pdf") contains no line-level detail. Ask your supplier for an itemised invoice.
            </p>
          </div>
        </div>
      )}

      {subState === 'form' && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{uploadedCategories.length} of {selectedCats.length} uploaded</span>
          <button
            onClick={startProcessing}
            disabled={!canProcess}
            className="px-6 py-2 rounded-lg text-white font-semibold text-sm"
            style={{
              backgroundColor: canProcess ? '#2FA37C' : '#9CA3AF',
              cursor: canProcess ? 'pointer' : 'not-allowed',
            }}
          >
            Process documents →
          </button>
        </div>
      )}

      {subState === 'results' && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
          <div>
            {skipConfirm ? (
              <span className="text-sm text-gray-600">
                This may reduce accuracy. Confirm?{' '}
                <button onClick={() => navigate('/status')} className="underline text-gray-800 font-medium">Yes</button>
                {' / '}
                <button onClick={() => setSkipConfirm(false)} className="underline text-gray-800 font-medium">Cancel</button>
              </span>
            ) : (
              <button onClick={() => setSkipConfirm(true)} className="text-sm text-gray-400 underline">
                Skip and submit anyway
              </button>
            )}
          </div>
          <button
            onClick={() => navigate('/review')}
            className="px-6 py-2 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: '#2FA37C' }}
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
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: accent ? '#FDE68A' : '#E2E8F0', backgroundColor: 'white' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: '#1F2A44' }}>{title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: accent ? '#FEF3C7' : '#EDF3F9', color: accent ? '#92400E' : '#2FA37C' }}>
            {count}
          </span>
        </div>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
