import { useState } from 'react'
import { requestBrowserLocation } from '../services/liveService'

export default function RouteSnapshot({ destination }) {
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('Location sharing is off.')
  const enableLocation = async () => {
    try {
      const position = await requestBrowserLocation()
      setLocation(position.coords)
      setMessage('Live location is ON · shared only in this browser session.')
    } catch (error) {
      setMessage(error.message)
    }
  }
  const stopLocation = () => { setLocation(null); setMessage('Live location is OFF.') }
  return <section className="route-snapshot"><div className="route-map"><span className="map-grid" /><div className="map-route" /><span className="map-pin current">●</span><span className="map-pin destination">◆</span><div className="map-label current-label">YOU</div><div className="map-label destination-label">{destination}</div></div><div className="route-details"><p className="home-eyebrow">LOCATION INTELLIGENCE</p><h2>Your route, in context.</h2><p className="route-copy">A map provider can add live distance, directions, and route lines here without changing the trip model.</p><div className={`location-state ${location ? 'on' : ''}`}><span>◉</span><b>{message}</b></div>{location && <p className="coordinates">{location.latitude.toFixed(4)}° N · {location.longitude.toFixed(4)}° E · accuracy {Math.round(location.accuracy)}m</p>}<button onClick={location ? stopLocation : enableLocation}>{location ? 'Stop sharing location' : 'Use my location'}</button></div></section>
}
