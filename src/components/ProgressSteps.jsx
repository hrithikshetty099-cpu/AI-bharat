const steps = ['Trip Details', 'AI Planning', 'Itinerary', 'Live Adaptation']

export default function ProgressSteps() {
  return (
    <nav className="progress-steps" aria-label="Trip planning progress">
      {steps.map((step, index) => (
        <div className={`progress-step ${index === 0 ? 'active' : ''}`} key={step}>
          <span className="step-number">{index + 1}</span>
          <span>{step}</span>
          {index < steps.length - 1 && <span className="step-line" aria-hidden="true" />}
        </div>
      ))}
    </nav>
  )
}
