import { useEffect, useState } from 'react'
import { searchBuses } from '../services/transportService'

export default function BusSearch({ tripData, onSelect, onBack }) {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const search = () => {
    setLoading(true); setError(''); setSearched(true)
    searchBuses({ from: tripData.startingLocation, to: tripData.destination, date: tripData.travelDate, passengers: tripData.travellers })
      .then((result) => setBuses(result.data || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }
  useEffect(() => { if (tripData?.startingLocation && tripData?.destination && tripData?.travelDate) search() }, [tripData])
  return <main className="booking-page"><header className="subpage-nav"><button className="site-brand" onClick={onBack}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><button className="back-link" onClick={onBack}>← Back to planner</button></header><section className="booking-heading"><p className="home-eyebrow">STEP 02 / TRANSPORT</p><h1>Choose your<br /><em>way there.</em></h1><p>Search live bus inventory for your selected route.</p></section><section className="bus-search-form"><input value={tripData.startingLocation || ''} readOnly aria-label="From" placeholder="From" /><span>→</span><input value={tripData.destination || ''} readOnly aria-label="To" placeholder="To" /><input value={tripData.travelDate || ''} readOnly aria-label="Travel date" /><input value={tripData.travellers || 1} readOnly aria-label="Passengers" /><button className="primary-action" onClick={search}>Search buses</button></section>{error && <div className="booking-error transport-unavailable">{error} <button onClick={search}>Retry</button></div>}{loading && <div className="empty-itinerary">Checking live provider inventory...</div>}{!loading && searched && !error && !buses.length && <div className="booking-error transport-unavailable">Live bus availability is currently unavailable.</div>}<section className="bus-list">{buses.map((bus) => <article className="bus-card" key={bus.id}><div className="bus-operator"><span className="bus-logo">{String(bus.operator).slice(0, 1)}</span><div><h2>{bus.operator}</h2><small>{bus.busName} · {bus.busType}</small></div></div><div className="bus-route"><strong>{bus.departure}</strong><span>→ {bus.duration}</span><strong>{bus.arrival}</strong></div><div className="bus-details"><span><small>BOARDING</small>{bus.boarding}</span><span><small>DROPPING</small>{bus.dropping}</span><span><small>AVAILABLE SEATS</small>{bus.availableSeats ?? 'Information unavailable'}</span><span><small>TICKET PRICE</small><b>{bus.fare === null ? 'Price unavailable' : `₹${bus.fare}`}</b></span><span><small>RATING</small>{bus.rating ?? 'Information unavailable'}</span></div><button className="primary-action" onClick={() => onSelect(bus)}>View seats / Book now <span>→</span></button></article>)}</section></main>
}
