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
    setIndex(i => i + 1)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F2F7' }}>
        <TopBar step="Step 3 of 3 · Review flagged items" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E5EF', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D1840', marginBottom: '20px' }}>All items reviewed</h2>
            <div className="flex flex-col gap-2 mb-8 text-left">
              {FLAGGED_IDS.map(id => {
                const item = LINE_ITEMS.find(i => i.id === id)
                const r = resolutions[id]
                return (
                  <div key={id} className="flex items-center gap-3" style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E5EF' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', flexShrink: 0, backgroundColor: r?.type === 'approved' ? '#ECFDF5' : '#F3F4F6', color: r?.type === 'approved' ? '#059669' : '#6B7280' }}>
                      {r?.type === 'approved' ? 'Approved' : 'Skipped'}
                    </span>
                    <span style={{ fontSize: '13px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</span>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => navigate('/status')}
              style={{ width: '100%', padding: '11px', backgroundColor: '#1B3DBF', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Submit to SpAC →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F0F2F7' }}>
      <TopBar step="Step 3 of 3 · Review flagged items" />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '45%', overflowY: 'auto', backgroundColor: '#F0F2F7', borderRight: '1px solid #E2E5EF' }}>
          <InvoicePanel highlightId={currentId} />
        </div>
        <div style={{ width: '55%', overflowY: 'auto', backgroundColor: '#F0F2F7' }}>
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
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <img src={`${import.meta.env.BASE_URL}8503509.jpg`} alt="Staples invoice" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
      <img src={`${import.meta.env.BASE_URL}7600881.jpg`} alt="Second invoice" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E5EF', padding: '16px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>Line items</p>
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <tbody>
            {LINE_ITEMS.map(item => (
              <tr key={item.id} style={{ backgroundColor: item.id === highlightId ? '#EEF1FB' : undefined, borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '7px 8px 7px 0', color: '#9CA3AF', width: '20px' }}>{item.id}</td>
                <td style={{ padding: '7px 8px', color: '#374151', fontWeight: 500, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</td>
                <td style={{ padding: '7px 8px', textAlign: 'right', color: '#6B7280' }}>{item.qty}</td>
                <td style={{ padding: '7px 0 7px 8px', textAlign: 'right', fontWeight: 500, color: item.extractedPrice != null ? '#D97706' : '#0D1840' }}>
                  €{(item.extractedPrice ?? item.price).toFixed(2)}
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
    : 'No SpAC equivalent found'

  const issueColor = item.id === 8 ? '#6B7280' : '#D97706'

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E5EF', padding: '20px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Item {index + 1} of {total}</span>
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i < index ? '#1B3DBF' : i === index ? '#3D60FF' : '#E2E5EF' }} />
            ))}
          </div>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0D1840', marginBottom: '4px' }}>{item.desc}</h2>
        <p style={{ fontSize: '13px', color: issueColor }}>{issueLabel}</p>
      </div>

      {item.id === 4 && <ExtractionForm item={item} onResolve={onResolve} />}
      {item.id === 3 && <MatchForm item={item} onResolve={onResolve} />}
      {item.id === 8 && <NoMatchForm item={item} onResolve={onResolve} />}
    </div>
  )
}

const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E5EF', padding: '20px' }

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  )
}

function LockedField({ value }) {
  return (
    <div style={{ padding: '9px 12px', borderRadius: '7px', fontSize: '13px', backgroundColor: '#F8FAFC', border: '1px solid #E2E5EF', color: '#374151' }}>{value}</div>
  )
}

function ExtractionForm({ item, onResolve }) {
  const [unitPrice, setUnitPrice] = useState(String(item.extractedPrice))
  const numVal = parseFloat(unitPrice)
  const lineTotal = !isNaN(numVal) ? (item.qty * numVal).toFixed(2) : '—'

  return (
    <>
      <div style={{ ...cardStyle, backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#92400E', marginBottom: '6px' }}>What we extracted</p>
        <p style={{ fontSize: '13px', color: '#374151' }}>
          Unit price read as <span style={{ fontWeight: 700, color: '#D97706' }}>€{item.extractedPrice}</span> — this looks too low for shredder bags. Please correct if needed.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <Field label="Description"><LockedField value={item.desc} /></Field>
          <Field label="Ref"><LockedField value={item.ref} /></Field>
          <Field label="Quantity"><LockedField value={`${item.qty} ${item.unit}`} /></Field>
          <Field label="Unit price €">
            <input
              type="number"
              value={unitPrice}
              onChange={e => setUnitPrice(e.target.value)}
              step="0.01"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', fontSize: '13px', border: '1.5px solid #D97706', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
          </Field>
        </div>
        <div className="flex items-center justify-between" style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E5EF', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>Line total</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0D1840' }}>€{lineTotal}</span>
        </div>
        <Actions onApprove={() => onResolve(item.id, { type: 'approved', unitPrice: numVal })} onSkip={() => onResolve(item.id, { type: 'skipped' })} />
      </div>
    </>
  )
}

function MatchForm({ item, onResolve }) {
  const [selected, setSelected] = useState(MATCH_CANDIDATES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!dropdownOpen) return
    function handler(e) { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const saving = item.price - selected.spaCPrice
  const savingPct = ((saving / item.price) * 100).toFixed(1)

  return (
    <div style={cardStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <Field label="Description"><LockedField value={item.desc} /></Field>
        <Field label="Ref"><LockedField value={item.ref} /></Field>
        <Field label="Quantity"><LockedField value={`${item.qty} ${item.unit}`} /></Field>
        <Field label="Your price"><LockedField value={`€${item.price.toFixed(2)}`} /></Field>
      </div>

      <Field label="SpAC match">
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '7px', border: '1.5px solid #1B3DBF', backgroundColor: '#EEF1FB', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0D1840' }}>{selected.name}</span>
              <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px' }}>€{selected.spaCPrice} · {selected.score}% match</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {dropdownOpen && (
            <MatchDropdown ref={dropdownRef} candidates={MATCH_CANDIDATES} selected={selected} onSelect={c => { setSelected(c); setDropdownOpen(false) }} />
          )}
        </div>
        <ConfidenceBar score={selected.score} />
      </Field>

      {saving > 0 && (
        <div className="flex items-center justify-between" style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F0FDF4', border: '1px solid #A7F3D0', margin: '16px 0' }}>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>Saving per unit</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#059669' }}>€{saving.toFixed(2)} ({savingPct}%)</span>
        </div>
      )}

      <Actions onApprove={() => onResolve(item.id, { type: 'approved', match: selected })} onSkip={() => onResolve(item.id, { type: 'skipped' })} />
    </div>
  )
}

function NoMatchForm({ item, onResolve }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <Field label="Description"><LockedField value={item.desc} /></Field>
        <Field label="Ref"><LockedField value={item.ref} /></Field>
        <Field label="Quantity"><LockedField value={`${item.qty} ${item.unit}`} /></Field>
        <Field label="Your price"><LockedField value={`€${item.price.toFixed(2)}`} /></Field>
      </div>
      <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E5EF', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' }}>No SpAC equivalent found</p>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>SpAC doesn't currently carry a direct equivalent. You can skip — it won't block submission.</p>
      </div>
      <Actions onApprove={() => onResolve(item.id, { type: 'approved' })} onSkip={() => onResolve(item.id, { type: 'skipped' })} approveLabel="Mark as reviewed" />
    </div>
  )
}

function Actions({ onApprove, onSkip, approveLabel = 'Approve →' }) {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button onClick={onApprove} style={{ flex: 1, padding: '11px', backgroundColor: '#1B3DBF', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
        {approveLabel}
      </button>
      <button onClick={onSkip} style={{ padding: '11px 20px', backgroundColor: '#FFFFFF', color: '#374151', border: '1px solid #E2E5EF', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
        Skip for later
      </button>
    </div>
  )
}

const MatchDropdown = forwardRef(function MatchDropdown({ candidates, selected, onSelect }, ref) {
  const [query, setQuery] = useState('')
  const filtered = candidates.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div ref={ref} style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E5EF', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', zIndex: 20 }}>
      <div style={{ padding: '8px', borderBottom: '1px solid #F3F4F6' }}>
        <input autoFocus type="text" placeholder="Search…" value={query} onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #E2E5EF', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {filtered.map(c => (
          <button key={c.name} onClick={() => onSelect(c)} style={{ width: '100%', display: 'block', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: c.name === selected.name ? '#1B3DBF' : '#0D1840', marginBottom: '2px' }}>{c.name}</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{c.unit} · €{c.spaCPrice} · {c.score}% match</p>
          </button>
        ))}
        {filtered.length === 0 && <p style={{ fontSize: '12px', color: '#9CA3AF', padding: '12px' }}>No results</p>}
      </div>
    </div>
  )
})

function ConfidenceBar({ score }) {
  const color = score >= 70 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
      <div style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: '99px', height: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', backgroundColor: color, borderRadius: '99px' }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 600, color }}>{score}% confidence</span>
    </div>
  )
}

