import ExpenseDashboard from '../components/ExpenseDashboard'
import RouteSnapshot from '../components/RouteSnapshot'
import TransportPlan from '../components/TransportPlan'

function Stat({ icon, label, value }) {
  return <div className="itinerary-stat"><span className="stat-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>
}

export default function Itinerary({ itinerary, serverResponse, tripData, onBack, onLive }) {
  if (!itinerary) return <main className="itinerary-shell"><div className="empty-state"><span className="empty-icon">✦</span><h1>Your plan is waiting</h1><p>Return to the planner to create your personalized Indian journey.</p><button onClick={onBack}>Back to planner</button></div></main>

  return (
    <main className="itinerary-shell">
      <header className="itinerary-topbar"><button className="back-button" onClick={onBack} aria-label="Back to trip planner">← <span>Plan another trip</span></button><div className="mini-brand"><span>✦</span> AI BHARAT <b>TRAVEL</b></div><button className="live-link" onClick={onLive}>Start Live Trip ↗</button></header>
      <section className="itinerary-heading"><div><p className="eyebrow"><span /> <strong>AI GENERATED PLAN</strong></p><h1>Your {itinerary.days}-day<br /><em>{itinerary.destination}</em> escape.</h1><p className="itinerary-lede">A thoughtful route shaped around your interests, pace, and budget.</p></div><div className="generated-badge"><span>✦</span><div><strong>Locally generated</strong><small>Ready for the next layer of AI</small></div></div></section>
      <section className="stats-grid"><Stat icon="₹" label="TOTAL ESTIMATED COST" value={`₹${itinerary.totalEstimatedCost.toLocaleString('en-IN')}`} /><Stat icon="↗" label="REMAINING BUDGET" value={`₹${itinerary.remainingBudget.toLocaleString('en-IN')}`} /><Stat icon="◷" label="ACTIVITY HOURS" value={`${itinerary.totalActivityHours || 0} hrs`} /><Stat icon="⌖" label="PLACES TO EXPLORE" value={itinerary.numberOfPlaces || 0} /></section>
      {serverResponse && <div className={`server-confirmation ${serverResponse.success ? '' : 'demo-confirmation'}`} role="status">{serverResponse.success ? '✓ Trip request successfully sent to AI Bharat Travel server.' : '✦ Demo AI mode activated · optimized local plan ready.'} <strong>{serverResponse.data.destination}</strong> · ₹{Number(serverResponse.data.budget).toLocaleString('en-IN')}</div>}
      {itinerary.warning && <div className="itinerary-warning">⚠ {itinerary.warning}</div>}
      <section className="summary-panel"><div className="summary-label">✦ WHY THIS PLAN</div><p>{itinerary.aiSummary}</p><small>⌁ {itinerary.estimatedTravelTime}</small></section>
      <RouteSnapshot destination={itinerary.destination} />
      <TransportPlan tripData={tripData || serverResponse?.request || { destination: itinerary.destination }} />
      <div className="days-heading"><div><span className="section-kicker">YOUR ROUTE</span><h2>Day by day</h2></div><span className="days-count">{itinerary.days} {itinerary.days === 1 ? 'DAY' : 'DAYS'}</span></div>
      <section className="day-list">
        {itinerary.dailyPlans.length === 0 ? <div className="empty-itinerary">No attractions could be added within this budget. Try increasing your budget and generating again.</div> : itinerary.dailyPlans.map((day) => <article className="day-card" key={day.day}><div className="day-number"><span>DAY</span><strong>{String(day.day).padStart(2, '0')}</strong></div><div className="activity-list">{day.activities.map((activity) => <div className={`activity-row ${activity.isBreak ? 'food-break' : ''}`} key={activity.placeId}><div className="activity-time"><span>◷</span>{activity.startTime}<b>—</b>{activity.endTime}</div><div className="activity-main"><div className="activity-title"><h3>{activity.placeName}</h3><span>{activity.category}</span></div><p><span>⌖</span>{activity.location}</p><p className="activity-reason"><strong>✦ Why AI recommends this</strong> {activity.reason}</p></div><div className="activity-cost">{activity.isBreak ? 'Flexible' : `₹${activity.estimatedCost.toLocaleString('en-IN')}`}</div></div>)}</div></article>)}
      </section>
      <ExpenseDashboard budget={Number(tripData?.budget || serverResponse?.data?.budget || itinerary.budget || itinerary.remainingBudget + itinerary.totalEstimatedCost)} initialBusCost={tripData?.busCost || 0} />
      <section className="trip-actions"><button onClick={() => window.alert('Booking integration ready. Continue to a provider when connected.')}>Book / reserve ↗</button><button onClick={() => navigator.share ? navigator.share({ title: `BharatTrails trip to ${itinerary.destination}`, text: itinerary.aiSummary }) : window.alert('Trip summary ready to share from this browser.')}>Share trip ↗</button></section>
      <footer className="footer"><span>AI BHARAT TRAVEL</span><span>Built for the curious traveller</span></footer>
    </main>
  )
}
