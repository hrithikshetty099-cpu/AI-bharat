import { useState } from 'react'
import { indianPlaces } from '../data/indianPlaces'

const regions = ['All India', 'North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India', 'Island India']

export default function Explore({ onPlan }) {
  const [region, setRegion] = useState('All India')
  const [query, setQuery] = useState('')
  const visiblePlaces = indianPlaces.filter((place) => (region === 'All India' || place.region === region) && [place.name, place.city, place.state].join(' ').toLowerCase().includes(query.toLowerCase()))
  return <main className="explore-page"><header className="subpage-nav"><button className="site-brand" onClick={onPlan}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><button className="back-link" onClick={onPlan}>← Back to planning</button></header><section className="explore-heading"><p className="home-eyebrow">THE INDIA INDEX</p><h1>Find your next<br /><em>beautiful detour.</em></h1><p>Explore places selected for the way India actually feels: layered, surprising, and worth taking slowly.</p></section><div className="explore-controls"><div className="region-tabs">{regions.map((item) => <button className={region === item ? 'active' : ''} key={item} onClick={() => setRegion(item)}>{item}</button>)}</div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places, cities, states" aria-label="Search places" /></div><section className="place-grid">{visiblePlaces.map((place, index) => <article className="place-card" key={place.id}><div className={`place-art place-art-${index % 5}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{place.category}</b></div><div className="place-card-content"><p>{place.state} · {place.city}</p><h2>{place.name}</h2><span>{place.description}</span><footer><small>{place.estimatedVisitHours} hrs</small><small>₹{place.estimatedCost.toLocaleString('en-IN')} est.</small></footer></div></article>)}</section>{!visiblePlaces.length && <div className="empty-itinerary">No Indian places match that search yet.</div>}</main>
}
