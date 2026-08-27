export default function Field({ label, hint, error, children, className = '' }) {
  return (
    <div className={`field ${className}`}>
      <div className="field-heading">
        <label>{label}</label>
        {hint && <span className="field-hint">{hint}</span>}
      </div>
      {children}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}
