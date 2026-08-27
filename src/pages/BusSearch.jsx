import { useEffect, useState } from 'react'
import { searchBuses } from '../services/transportService'

export default function BusSearch({ tripData, onSelect, onBack }) {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    searchBuses({ from: tripData.startingLocation || 'Mangaluru', to: tripData.destination, date: tripData.travelDate })
      .then((result) => setBuses(result.data || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [tripData])
  return <main className="booking-page"><header className="subpage-nav"><button className="site-brand" onClick={onBack}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><button className="back-link" onClick={onBack}>← Back to planner</button></header><section className="booking-heading"><p className="home-eyebrow">STEP 02 / TRANSPORT</p><h1>Choose your<br /><em>way there.</em></h1><p>Estimated demo availability for {tripData.startingLocation || 'your starting point'} → {tripData.destination}.</p></section><div className="demo-banner">ⓘ DEMO BUS AVAILABILITY · No live seats or ticket prices are being claimed.</div><section className="bus-list">{loading && <div className="empty-itinerary">Searching estimated options...</div>}{error && <div className="booking-error">{error}</div>}{buses.map((bus) => <article className="bus-card" key={bus.id}><div className="bus-operator"><span className="bus-logo">{bus.operator_name.slice(0, 1)}</span><div><h2>{bus.operator_name}</h2><small>{bus.bus_type} · Demo availability</small></div></div><div className="bus-route"><strong>{bus.departure_time}</strong><span>→ {bus.duration}</span><strong>{bus.arrival_time}</strong></div><div className="bus-details"><span><small>BOARDING</small>{bus.boarding_point}</span><span><small>DROPPING</small>{bus.dropping_point}</span><span><small>SEATS</small>{bus.seat_availability}</span><span><small>FARE / PASSENGER</small><b>₹{bus.fare_per_passenger}</b></span></div><button className="primary-action" onClick={() => onSelect(bus)}>Select bus <span>→</span></button></article>)}</section></main>
}
