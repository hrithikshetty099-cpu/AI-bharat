export default function TransportPlan({ tripData }) {
  const transport = tripData?.transportation || 'Public Transport'
  const origin = tripData?.startingLocation || 'Your starting location'
  const departure = tripData?.departureTime || '06:00'
  const destination = tripData?.destination || 'Your destination'
  return <section className="transport-plan"><div className="transport-plan-heading"><div><p className="home-eyebrow">ESTIMATED TRANSIT</p><h2>Getting there</h2></div><span>DEMO / ESTIMATED</span></div><div className="transport-segment"><div className="transport-icon">{transport === 'Bus' ? '🚌' : transport === 'Train' ? '🚆' : transport === 'Cab' ? '🚕' : '→'}</div><div><strong>{transport}</strong><p>{origin} <b>→</b> {destination}</p></div><div className="transport-time"><small>DEPARTURE</small><b>{departure}</b></div><div className="transport-time"><small>EST. ARRIVAL</small><b>01:00 PM</b></div><div className="transport-cost"><small>EST. FARE</small><b>₹500</b></div></div><p className="transport-note">No live transport schedule or fare is being claimed. Connect a provider to replace these estimates.</p></section>
}
