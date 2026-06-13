export default function TopBar({ step }) {
  return (
    <div className="w-full flex items-center justify-between px-8" style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E5EF',
      height: '60px',
    }}>
      <span style={{
        fontFamily: "'Georgia', serif",
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: '22px',
        color: '#0D1E5C',
        letterSpacing: '-0.5px',
      }}>
        SpAC
      </span>
      <div className="flex items-center gap-4">
        {step && (
          <span style={{ fontSize: '13px', color: '#6B7280' }}>{step}</span>
        )}
        <div className="flex items-center gap-2 pl-4" style={{ borderLeft: '1px solid #E2E5EF' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#1B3DBF' }}>
            H
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#0D1840' }}>Hartmann &amp; Co</span>
        </div>
      </div>
    </div>
  )
}
