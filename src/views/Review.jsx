import { useState, useEffect, useRef, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { LINE_ITEMS, MATCH_CANDIDATES, FELLOWES_MATCH } from '../data'

const TOPBAR_HEIGHT = 52

export default function Review() {
  const [focusedRowId, setFocusedRowId] = useState(null)
  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      <TopBar step="Step 3 of 3 · Review flagged items" />
      <div className="flex flex-1 overflow-hidden">
        <div className="overflow-y-auto" style={{ width: '40%', height: `calc(100vh - ${TOPBAR_HEIGHT}px)` }}>
          <MockInvoice focusedRowId={focusedRowId} />
        </div>
        <div className="overflow-y-auto border-l border-gray-200" style={{ width: '60%', height: `calc(100vh - ${TOPBAR_HEIGHT}px)` }}>
          <ReviewTable setFocusedRowId={setFocusedRowId} />
        </div>
      </div>
    </div>
  )
}

function MockInvoice({ focusedRowId }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <img src={`${import.meta.env.BASE_URL}8503509.jpg`} alt="Staples invoice" className="w-full rounded-lg shadow-md" />
      <img src={`${import.meta.env.BASE_URL}7600881.jpg`} alt="Second invoice" className="w-full rounded-lg shadow-md" />
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Extracted line items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Description', 'Qty', 'Unit', 'Price €'].map(h => (
                  <th key={h} className={`py-1 pr-2 text-gray-400 font-medium ${h === '#' || h === 'Qty' || h === 'Unit' || h === 'Price €' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINE_ITEMS.map(item => (
                <tr
                  key={item.id}
                  style={{ backgroundColor: focusedRowId === item.id ? '#FEFCE8' : undefined }}
                  className="border-b border-gray-50 transition-colors"
                >
                  <td className="py-1.5 pr-2 text-right text-gray-400">{item.id}</td>
                  <td className="py-1.5 pr-2 text-gray-700 font-medium" style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'table-cell' }}>{item.desc}</td>
                  <td className="py-1.5 pr-2 text-right text-gray-600">{item.qty}</td>
                  <td className="py-1.5 pr-2 text-right text-gray-500">{item.unit}</td>
                  <td className="py-1.5 text-right text-gray-700">
                    {item.extractedPrice != null
                      ? <span style={{ color: '#F59E0B' }}>€{item.extractedPrice.toFixed(2)}</span>
                      : `€${item.price.toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const INITIAL_ROW_STATES = {
  1: 'auto', 2: 'auto', 3: 'match_review', 4: 'extraction_error',
  5: 'auto', 6: 'auto', 7: 'auto', 8: 'no_match', 9: 'auto',
}

function ReviewTable({ setFocusedRowId }) {
  const navigate = useNavigate()
  const [rowStates, setRowStates] = useState(INITIAL_ROW_STATES)
  const [submitted, setSubmitted] = useState(false)

  function setRowStatus(id, status) {
    setRowStates(prev => ({ ...prev, [id]: status }))
  }

  const resolvedCount = [3, 4, 8].filter(id => rowStates[id] === 'approved' || rowStates[id] === 'flagged').length
  const canSubmit = rowStates[3] === 'approved' && rowStates[4] === 'approved' && (rowStates[8] === 'approved' || rowStates[8] === 'flagged')

  function handleSubmit() {
    if (!canSubmit || submitted) return
    setSubmitted(true)
    setTimeout(() => navigate('/status'), 800)
  }

  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-3 z-10">
        <p className="text-xs text-gray-400">3 items flagged · Office supplies · INV-2024-8821</p>
      </div>
      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
        {LINE_ITEMS.map(item => (
          <ReviewRow
            key={item.id}
            item={item}
            status={rowStates[item.id]}
            setStatus={s => setRowStatus(item.id, s)}
            onFocus={() => setFocusedRowId(item.id)}
            onBlur={() => setFocusedRowId(null)}
          />
        ))}
      </div>
      <div
        className="fixed bottom-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between z-10"
        style={{ width: '60%', right: 0 }}
      >
        <span className="text-sm text-gray-500">{resolvedCount} of 3 resolved</span>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all"
          style={{ backgroundColor: canSubmit ? '#2FA37C' : '#9CA3AF', cursor: canSubmit ? 'pointer' : 'not-allowed' }}
        >
          {submitted ? 'Submitted ✓' : 'Approve all & submit →'}
        </button>
      </div>
    </div>
  )
}

function ReviewRow({ item, status, setStatus, onFocus, onBlur }) {
  return (
    <div
      className="rounded-xl p-4 transition-colors"
      style={{
        backgroundColor: status === 'approved' ? '#ECFDF5' : 'white',
        border: `1px solid ${status === 'approved' ? '#A7F3D0' : '#E2E8F0'}`,
      }}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: '#1F2A44' }}>{item.desc}</p>
          <p className="text-xs text-gray-400">{item.ref} · {item.qty} {item.unit}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {status === 'auto' && item.capsMatch && (
        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: '#2FA37C' }}>
              {item.capsMatch.name}
            </span>
            <span className="text-xs font-semibold" style={{ color: '#2FA37C' }}>€{item.capsMatch.price} · -{item.capsMatch.savings}%</span>
          </div>
          <button
            onClick={() => setStatus('approved')}
            className="text-xs px-3 py-1 rounded-lg font-medium text-white shrink-0"
            style={{ backgroundColor: '#2FA37C' }}
          >
            ✓ Approve
          </button>
        </div>
      )}

      {status === 'approved' && item.capsMatch && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: '#2FA37C' }}>
            {item.capsMatch.name} · €{item.capsMatch.price}
          </span>
        </div>
      )}

      {item.id === 4 && (status === 'extraction_error' || status === 'extraction_corrected') && (
        <ExtractionErrorRow item={item} status={status} setStatus={setStatus} />
      )}

      {item.id === 3 && (status === 'match_review' || status === 'match_selected') && (
        <MatchReviewRow item={item} status={status} setStatus={setStatus} />
      )}

      {item.id === 8 && status === 'no_match' && (
        <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-gray-400 italic">No CaPS equivalent found</span>
          <button
            onClick={() => setStatus('flagged')}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600 font-medium shrink-0"
          >
            Flag for manual review
          </button>
        </div>
      )}

      {item.id === 8 && status === 'flagged' && (
        <p className="mt-1 text-xs text-gray-400 italic">Flagged — will not block submission</p>
      )}
    </div>
  )
}

function ExtractionErrorRow({ item, setStatus }) {
  const [value, setValue] = useState(String(item.extractedPrice))
  const [corrected, setCorrected] = useState(false)
  const numVal = parseFloat(value)
  const changed = !isNaN(numVal) && numVal !== item.extractedPrice

  return (
    <div className="mt-3">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Unit price €</label>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={corrected}
            step="0.01"
            className="text-sm px-2 py-1 rounded-lg w-24"
            style={{
              border: corrected ? '1px solid #E2E8F0' : '1.5px solid #F59E0B',
              outline: 'none',
              backgroundColor: corrected ? '#F9FAFB' : 'white',
            }}
          />
        </div>
        <div className="text-sm text-gray-500 pb-1">
          Total: <span className="font-semibold" style={{ color: '#1F2A44' }}>€{(item.qty * (parseFloat(value) || 0)).toFixed(2)}</span>
        </div>
      </div>

      {!corrected && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs italic text-gray-400">Resolve extraction first</span>
          <button
            onClick={() => setCorrected(true)}
            disabled={!changed}
            className="text-xs px-3 py-1 rounded-lg font-medium text-white"
            style={{ backgroundColor: changed ? '#1F2A44' : '#9CA3AF', cursor: changed ? 'pointer' : 'not-allowed' }}
          >
            Correct & continue →
          </button>
        </div>
      )}

      {corrected && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: '#2FA37C' }}>
            {FELLOWES_MATCH.name} · €{FELLOWES_MATCH.price}/pack · {FELLOWES_MATCH.score}%
          </span>
          <button
            onClick={() => setStatus('approved')}
            className="text-xs px-3 py-1 rounded-lg font-medium text-white shrink-0"
            style={{ backgroundColor: '#2FA37C' }}
          >
            Approve match
          </button>
        </div>
      )}
    </div>
  )
}

function MatchReviewRow({ setStatus }) {
  const [selectedCandidate, setSelectedCandidate] = useState(MATCH_CANDIDATES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  return (
    <div className="mt-3 relative">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-1 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: '#2FA37C' }}>
            {selectedCandidate.name}
          </span>
          <span className="text-xs font-semibold" style={{ color: '#2FA37C' }}>€{selectedCandidate.capsPrice}</span>
        </div>
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="text-xs underline text-gray-500 shrink-0"
        >
          Change ›
        </button>
      </div>

      <ConfidenceBar score={selectedCandidate.score} />

      {dropdownOpen && (
        <MatchDropdown
          ref={dropdownRef}
          candidates={MATCH_CANDIDATES}
          selected={selectedCandidate}
          onSelect={c => { setSelectedCandidate(c); setDropdownOpen(false) }}
        />
      )}

      <button
        onClick={() => setStatus('approved')}
        className="mt-2 text-xs px-3 py-1 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#2FA37C' }}
      >
        Approve match
      </button>
    </div>
  )
}

const MatchDropdown = forwardRef(function MatchDropdown({ candidates, selected, onSelect }, ref) {
  const [query, setQuery] = useState('')
  const filtered = candidates.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div
      ref={ref}
      className="absolute z-20 bg-white rounded-xl shadow-xl border border-gray-100 w-80 mt-1"
      style={{ left: 0, top: '100%' }}
    >
      <div className="p-2 border-b border-gray-100">
        <input
          autoFocus
          type="text"
          placeholder="Search candidates…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-200 outline-none"
          style={{ '--tw-ring-color': '#2FA37C' }}
        />
      </div>
      <div className="max-h-52 overflow-y-auto">
        {filtered.map(c => (
          <button
            key={c.name}
            onClick={() => onSelect(c)}
            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <p className="font-semibold text-sm" style={{ color: c.name === selected.name ? '#2FA37C' : '#1F2A44' }}>{c.name}</p>
            <p className="text-xs text-gray-400">{c.unit} · €{c.capsPrice}</p>
            <ConfidenceBar score={c.score} small />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 px-3 py-3">No matches found</p>
        )}
      </div>
    </div>
  )
})

function ConfidenceBar({ score, small }) {
  const color = score >= 70 ? '#2FA37C' : score >= 50 ? '#F59E0B' : '#EF4444'
  return (
    <div className={`flex items-center gap-2 ${small ? 'mt-1' : 'mb-1'}`}>
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${small ? 'h-1' : 'h-1.5'}`}>
        <div className="rounded-full h-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{score}%</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    auto: { label: 'Ready', bg: '#ECFDF5', color: '#2FA37C' },
    approved: { label: 'Approved', bg: '#ECFDF5', color: '#2FA37C' },
    extraction_error: { label: 'Needs review', bg: '#FEF3C7', color: '#92400E' },
    match_review: { label: 'Review match', bg: '#FEF9C3', color: '#854D0E' },
    no_match: { label: 'No match', bg: '#FEF2F2', color: '#991B1B' },
    flagged: { label: 'Flagged', bg: '#F3F4F6', color: '#6B7280' },
  }
  const c = config[status] || config.auto
  return (
    <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}
