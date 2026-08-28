import { useState } from 'react'
import { requestBrowserLocation } from '../services/liveService'
import GoogleMap from './GoogleMap'
import { indianPlaces } from '../data/indianPlaces'

export default function RouteSnapshot({ destination }) {
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('Location sharing is off.')

  const targetPlace = indianPlaces.find((p) => 
    p.name.toLowerCase().includes(destination.toLowerCase()) || 
    p.city.toLowerCase().includes(destination.toLowerCase())
  ) || indianPlaces[0]

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

  return <section className="route-snapshot">
    <div className="route-map" style={{ height: '230px', padding: 0 }}>
      <GoogleMap 
        location={location ? { latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy } : null} 
        nextDestination={targetPlace} 
        itineraryPlaces={[targetPlace]} 
      />
    </div>
    <div className="route-details">
      <p className="home-eyebrow">LOCATION INTELLIGENCE</p>
      <h2>Your route, in context.</h2>
      <p className="route-copy">Interactive OpenStreetMap is active showing destination coordinates and live location context.</p>
      <div className={`location-state ${location ? 'on' : ''}`}><span>◉</span><b>{message}</b></div>
      {location && <p className="coordinates">{location.latitude.toFixed(4)}° N · {location.longitude.toFixed(4)}° E · accuracy {Math.round(location.accuracy)}m</p>}
      <button onClick={location ? stopLocation : enableLocation}>{location ? 'Stop sharing location' : 'Use my location'}</button>
    </div>
  </section>
}

