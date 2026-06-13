import { useState, useEffect, useRef, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { LINE_ITEMS, MATCH_CANDIDATES, FELLOWES_MATCH } from '../data'

const FLAGGED_IDS = [4, 3, 8]

export default function Review() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [resolutions, setResolutions] = useState({})

  const currentId = FLAGGED_IDS[index]
  const currentItem = LINE_ITEMS.find(i => i.id === currentId)
  const total = FLAGGED_IDS.length
  const done = index >= total

  function resolve(id, resolution) {
    setResolutions(prev => ({ ...prev, [id]: resolution }))
    if (index < total - 1) {
      setIndex(i => i + 1)
    } else {
      setIndex(total)
    }
  }

  function handleSubmit() {
    navigate('/status')
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
        <TopBar step="Step 3 of 3 · Review flagged items" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ECFDF5' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2FA37C" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1F2A44' }}>All items reviewed</h2>
            <div className="flex flex-col gap-2 mb-8 mt-4 text-left">
              {FLAGGED_IDS.map(id => {
                const item = LINE_ITEMS.find(i => i.id === id)
                const r = resolutions[id]
                return (
                  <div key={id} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: r?.type === 'approved' ? '#ECFDF5' : '#F3F4F6', color: r?.type === 'approved' ? '#2FA37C' : '#6B7280' }}>
                      {r?.type === 'approved' ? 'Approved' : 'Skipped'}
                    </span>
                    <span className="text-sm text-gray-700 truncate">{item.desc}</span>
                  </div>
                )
              })}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm"
              style={{ backgroundColor: '#2FA37C' }}
            >
              Submit to CaPS →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      <TopBar step="Step 3 of 3 · Review flagged items" />
      <div className="flex flex-1 overflow-hidden">
        <div className="overflow-y-auto bg-gray-50 border-r border-gray-200" style={{ width: '45%' }}>
          <InvoicePanel highlightId={currentId} />
        </div>
        <div className="overflow-y-auto" style={{ width: '55%' }}>
          <ReviewPanel
            key={currentId}
            item={currentItem}
            index={index}
            total={total}
            onResolve={resolve}
          />
        </div>
      </div>
    </div>
  )
}

function InvoicePanel({ highlightId }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <img src={`${import.meta.env.BASE_URL}8503509.jpg`} alt="Staples invoice" className="w-full rounded-lg shadow" />
      <img src={`${import.meta.env.BASE_URL}7600881.jpg`} alt="Second invoice" className="w-full rounded-lg shadow" />
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Line items</p>
        <table className="w-full text-xs">
          <tbody>
            {LINE_ITEMS.map(item => (
              <tr
                key={item.id}
                className="border-b border-gray-50"
                style={{ backgroundColor: item.id === highlightId ? '#FEFCE8' : undefined }}
              >
                <td className="py-1.5 pr-2 text-gray-400 w-5">{item.id}</td>
                <td className="py-1.5 pr-2 text-gray-700 font-medium" style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</td>
                <td className="py-1.5 pr-2 text-right text-gray-500">{item.qty}</td>
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
  )
}

function ReviewPanel({ item, index, total, onResolve }) {
  const issueLabel = item.id === 4
    ? 'Extraction unclear — unit price may be wrong'
    : item.id === 3
    ? 'Low confidence match (72%) — please confirm'
    : 'No CaPS equivalent found'

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Item {index + 1} of {total}</span>
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < index ? '#2FA37C' : i === index ? '#1F2A44' : '#E2E8F0' }} />
            ))}
          </div>
        </div>
        <h2 className="text-lg font-bold" style={{ color: '#1F2A44' }}>{item.desc}</h2>
        <p className="text-xs mt-0.5" style={{ color: '#F59E0B' }}>{issueLabel}</p>
      </div>

      {item.id === 4 && <ExtractionForm item={item} onResolve={onResolve} />}
      {item.id === 3 && <MatchForm item={item} onResolve={onResolve} />}
      {item.id === 8 && <NoMatchForm item={item} onResolve={onResolve} />}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
      {children}
    </div>
  )
}

function LockedField({ value }) {
  return (
    <div className="px-3 py-2 rounded-lg text-sm bg-gray-50 border border-gray-200 text-gray-700">{value}</div>
  )
}

function ExtractionForm({ item, onResolve }) {
  const [unitPrice, setUnitPrice] = useState(String(item.extractedPrice))
  const numVal = parseFloat(unitPrice)
  const total = !isNaN(numVal) ? (item.qty * numVal).toFixed(2) : '—'

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-4 border border-amber-200" style={{ backgroundColor: '#FFFBEB' }}>
        <p className="text-xs font-medium mb-1" style={{ color: '#92400E' }}>What we extracted</p>
        <p className="text-sm text-gray-700">Unit price read as <span className="font-bold" style={{ color: '#F59E0B' }}>€{item.extractedPrice}</span> — this looks too low for a box of shredder bags. Please correct if needed.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Description">
          <LockedField value={item.desc} />
        </Field>
        <Field label="Ref">
          <LockedField value={item.ref} />
        </Field>
        <Field label="Qty">
          <LockedField value={`${item.qty} ${item.unit}`} />
        </Field>
        <Field label="Unit price €">
          <input
            type="number"
            value={unitPrice}
            onChange={e => setUnitPrice(e.target.value)}
            step="0.01"
            className="w-full px-3 py-2 rounded-lg text-sm border"
            style={{ border: '1.5px solid #F59E0B', outline: 'none' }}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
        <span className="text-xs text-gray-500">Line total</span>
        <span className="text-sm font-semibold" style={{ color: '#1F2A44' }}>€{total}</span>
      </div>

      <Actions onApprove={() => onResolve(item.id, { type: 'approved', unitPrice: numVal })} onSkip={() => onResolve(item.id, { type: 'skipped' })} />
    </div>
  )
}

function MatchForm({ item, onResolve }) {
  const [selected, setSelected] = useState(MATCH_CANDIDATES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!dropdownOpen) return
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Description">
          <LockedField value={item.desc} />
        </Field>
        <Field label="Ref">
          <LockedField value={item.ref} />
        </Field>
        <Field label="Qty">
          <LockedField value={`${item.qty} ${item.unit}`} />
        </Field>
        <Field label="Your price">
          <LockedField value={`€${item.price.toFixed(2)}`} />
        </Field>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">CaPS match</label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm text-left"
            style={{ border: '1.5px solid #2FA37C', backgroundColor: '#F0FDF4' }}
          >
            <div>
              <span className="font-medium" style={{ color: '#1F2A44' }}>{selected.name}</span>
              <span className="ml-2 text-xs text-gray-500">€{selected.capsPrice} · {selected.score}% match</span>
            </div>
            <span className="text-gray-400 text-xs ml-2">▼</span>
          </button>

          {dropdownOpen && (
            <MatchDropdown
              ref={dropdownRef}
              candidates={MATCH_CANDIDATES}
              selected={selected}
              onSelect={c => { setSelected(c); setDropdownOpen(false) }}
            />
          )}
        </div>
        <ConfidenceBar score={selected.score} />
      </div>

      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
        <span className="text-xs text-gray-500">Saving per unit</span>
        <span className="text-sm font-semibold" style={{ color: '#2FA37C' }}>
          €{(item.price - selected.capsPrice).toFixed(2)} ({((item.price - selected.capsPrice) / item.price * 100).toFixed(1)}%)
        </span>
      </div>

      <Actions onApprove={() => onResolve(item.id, { type: 'approved', match: selected })} onSkip={() => onResolve(item.id, { type: 'skipped' })} />
    </div>
  )
}

function NoMatchForm({ item, onResolve }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Description">
          <LockedField value={item.desc} />
        </Field>
        <Field label="Ref">
          <LockedField value={item.ref} />
        </Field>
        <Field label="Qty">
          <LockedField value={`${item.qty} ${item.unit}`} />
        </Field>
        <Field label="Your price">
          <LockedField value={`€${item.price.toFixed(2)}`} />
        </Field>
      </div>

      <div className="rounded-xl p-4 border border-gray-200 bg-gray-50">
        <p className="text-xs font-medium text-gray-500 mb-1">No CaPS equivalent found</p>
        <p className="text-sm text-gray-600">CaPS doesn't currently carry a direct equivalent for this item. You can skip it — it won't block submission.</p>
      </div>

      <Actions
        onApprove={() => onResolve(item.id, { type: 'approved' })}
        onSkip={() => onResolve(item.id, { type: 'skipped' })}
        approveLabel="Mark as reviewed"
      />
    </div>
  )
}

function Actions({ onApprove, onSkip, approveLabel = 'Approve →' }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        onClick={onApprove}
        className="flex-1 py-2.5 rounded-lg text-white font-semibold text-sm"
        style={{ backgroundColor: '#2FA37C' }}
      >
        {approveLabel}
      </button>
      <button
        onClick={onSkip}
        className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Skip for later
      </button>
    </div>
  )
}

const MatchDropdown = forwardRef(function MatchDropdown({ candidates, selected, onSelect }, ref) {
  const [query, setQuery] = useState('')
  const filtered = candidates.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div ref={ref} className="absolute z-20 bg-white rounded-xl shadow-xl border border-gray-100 w-full mt-1" style={{ top: '100%', left: 0 }}>
      <div className="p-2 border-b border-gray-100">
        <input
          autoFocus
          type="text"
          placeholder="Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-200 outline-none"
        />
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filtered.map(c => (
          <button key={c.name} onClick={() => onSelect(c)} className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors">
            <p className="font-semibold text-sm" style={{ color: c.name === selected.name ? '#2FA37C' : '#1F2A44' }}>{c.name}</p>
            <p className="text-xs text-gray-400">{c.unit} · €{c.capsPrice} · {c.score}% match</p>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-xs text-gray-400 px-3 py-3">No results</p>}
      </div>
    </div>
  )
})

function ConfidenceBar({ score }) {
  const color = score >= 70 ? '#2FA37C' : score >= 50 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="rounded-full h-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{score}% confidence</span>
    </div>
  )
}

