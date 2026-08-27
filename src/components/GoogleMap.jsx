import { useEffect, useRef, useState } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
let mapsPromise
function loadGoogleMaps() {
  if (!API_KEY) return Promise.reject(new Error('Google Maps API key is not configured.'))
  if (!mapsPromise) mapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps]')
    if (existing) { existing.addEventListener('load', () => resolve(window.google.maps)); existing.addEventListener('error', reject); return }
    const script = document.createElement('script')
    script.dataset.googleMaps = 'true'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}&libraries=geometry`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = () => reject(new Error('Google Maps could not load.'))
    document.head.appendChild(script)
  })
  return mapsPromise
}

export default function GoogleMap({ location, nextDestination, itineraryPlaces = [], onRecenter }) {
  const mapNode = useRef(null)
  const map = useRef(null)
  const userMarker = useRef(null)
  const destinationMarkers = useRef([])
  const [mode, setMode] = useState(API_KEY ? 'loading' : 'demo')
  useEffect(() => {
    let active = true
    loadGoogleMaps().then((maps) => {
      if (!active || !mapNode.current) return
      map.current = new maps.Map(mapNode.current, { center: { lat: nextDestination?.latitude || 12.9716, lng: nextDestination?.longitude || 77.5946 }, zoom: 13, mapTypeControl: false, streetViewControl: false, fullscreenControl: false })
      setMode('live')
    }).catch(() => { if (active) setMode('demo') })
    return () => { active = false }
  }, [nextDestination?.latitude, nextDestination?.longitude])
  useEffect(() => {
    if (mode !== 'live' || !map.current || !window.google?.maps) return
    const maps = window.google.maps
    if (location) {
      const position = { lat: location.latitude, lng: location.longitude }
      if (!userMarker.current) userMarker.current = new maps.Marker({ map: map.current, position, title: 'Your live location', icon: { path: maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#1e6a52', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 } })
      else userMarker.current.setPosition(position)
    }
    destinationMarkers.current.forEach((marker) => marker.setMap(null))
    destinationMarkers.current = itineraryPlaces.filter(Boolean).map((place, index) => new maps.Marker({ map: map.current, position: { lat: place.latitude, lng: place.longitude }, title: place.name, label: index === 0 ? 'N' : `${index + 1}`, icon: { path: maps.SymbolPath.BACKWARD_CLOSED_ARROW, scale: 5, fillColor: index === 0 ? '#e8753d' : '#b08a45', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 2 } }))
  }, [location, itineraryPlaces, mode])
  const recenter = () => { if (location && map.current) map.current.panTo({ lat: location.latitude, lng: location.longitude }); onRecenter?.() }
  return <div className="google-map-shell"><div ref={mapNode} className={`google-map-canvas ${mode === 'demo' ? 'demo-map' : ''}`}>{mode === 'demo' && <><span className="map-grid" /><div className="live-route-line" /><span className="live-map-pin user">●</span><span className="live-map-pin next">◆</span><div className="map-label user-label">{location ? 'YOU' : 'START'}</div><div className="map-label next-label">{nextDestination?.name || 'Next stop'}</div><div className="demo-map-stamp">DEMO MAP · ADD GOOGLE KEY FOR LIVE MAP</div></>}{mode === 'loading' && <span className="map-loading">Loading Google Map...</span>}</div><div className="map-mode-badge">{mode === 'live' ? 'GOOGLE MAP · LIVE' : 'DEMO MAP'}</div><div className="map-controls"><button onClick={recenter} disabled={!location} title="Center on my location">◎</button><button onClick={() => map.current?.setZoom((map.current.getZoom() || 13) + 1)} disabled={mode !== 'live'} title="Zoom in">+</button><button onClick={() => map.current?.setZoom(Math.max(3, (map.current.getZoom() || 13) - 1))} disabled={mode !== 'live'} title="Zoom out">−</button></div></div>
}
