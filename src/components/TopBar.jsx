export default function TopBar({ step }) {
  return (
    <div className="w-full flex items-center justify-between px-6 py-3" style={{ backgroundColor: '#1F2A44', minHeight: '52px' }}>
      <span className="text-white font-bold text-lg tracking-tight">CaPS</span>
      <div className="text-right">
        <span className="text-white font-medium text-sm">Hartmann &amp; Co</span>
        {step && (
          <span className="text-blue-200 text-sm ml-3 opacity-80">{step}</span>
        )}
      </div>
    </div>
  )
}
