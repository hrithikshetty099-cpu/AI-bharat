import { useEffect, useMemo, useRef, useState } from 'react'
import { indianPlaces } from '../data/indianPlaces'
import { getDemoWeather, getRoute, replanItinerary, stopLiveLocation, updateLiveLocation } from '../services/liveService'
import GoogleMap from '../components/GoogleMap'

const demoPath = [
  { latitude: 12.9716, longitude: 77.5946, accuracy: 18 },
  { latitude: 12.9782, longitude: 77.601, accuracy: 15 },
  { latitude: 12.9851, longitude: 77.608, accuracy: 12 },
]

const toRadians = (value) => value * Math.PI / 180
function distanceInKm(from, to) {
  if (!from || !to) return null
  const earthRadius = 6371
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const latitude = toRadians(from.latitude)
  const targetLatitude = toRadians(to.latitude)
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitude) * Math.cos(targetLatitude) * Math.sin(longitudeDelta / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
function timeAgo(timestamp) {
  if (!timestamp) return 'Waiting for a location update'
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000))
  return seconds < 5 ? 'Updated just now' : `Last updated ${seconds} seconds ago`
}
function friendlyLocationError(error) {
  if (error.code === 1) return 'Location access was not enabled.'
  if (error.code === 2) return 'Your location is temporarily unavailable.'
  if (error.code === 3) return 'Location took too long to respond. Try Demo Location instead.'
  return 'We could not access your location right now.'
}

export default function LiveTrip({ itinerary, tripData, onBack, onSafety, onAI, onComplete }) {
  const [tracking, setTracking] = useState(false)
  const [demoTracking, setDemoTracking] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [completed, setCompleted] = useState(0)
  const [decision, setDecision] = useState('')
  const [replanning, setReplanning] = useState(false)
  const [weather, setWeather] = useState(null)
  const [route, setRoute] = useState(null)
  const [arrived, setArrived] = useState(false)
  const [routeDeviation, setRouteDeviation] = useState(false)
  const watchId = useRef(null)
  const demoIndex = useRef(0)
  const activities = useMemo(() => itinerary?.dailyPlans?.flatMap((day) => day.activities.filter((activity) => !activity.isBreak)) || [], [itinerary])
  const nextActivity = activities[completed] || activities[activities.length - 1]
  const nextPlace = indianPlaces.find((place) => place.id === nextActivity?.placeId)
  const distance = distanceInKm(location, nextPlace)
  const progress = activities.length ? Math.round(completed / activities.length * 100) : 0
  const tripId = tripData?.tripId || tripData?.id || 'demo-live-trip'

  const stopTracking = () => {
    if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current)
    watchId.current = null
    stopLiveLocation(tripId).catch(() => {})
    setTracking(false)
    setDemoTracking(false)
  }

  useEffect(() => () => { if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current) }, [])

  useEffect(() => {
    if (!demoTracking) return undefined
    const updateDemoLocation = () => {
      setLocation({ ...demoPath[demoIndex.current % demoPath.length], timestamp: Date.now() })
      demoIndex.current += 1
    }
    updateDemoLocation()
    const timer = window.setInterval(updateDemoLocation, 7000)
    return () => window.clearInterval(timer)
  }, [demoTracking])

  useEffect(() => {
    if (!location) return
    getDemoWeather({ lat: location.latitude, lng: location.longitude }).then((result) => setWeather(result.data)).catch(() => {})
    if (!nextPlace) return
    getRoute({ lat: location.latitude, lng: location.longitude }, { lat: nextPlace.latitude, lng: nextPlace.longitude }).then((result) => setRoute(result.data)).catch(() => {})
    const nextDistance = distanceInKm(location, nextPlace)
    setArrived(nextDistance <= 0.15)
    setRouteDeviation(nextDistance > 15)
  }, [location, nextPlace?.name, itinerary?.destination])

  const allowLocation = () => {
    setLocationError('')
    if (!navigator.geolocation) { setLocationError('Location is not supported by this browser.'); return }
    setTracking(true)
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, timestamp: Date.now() }
        setLocation(nextLocation)
        updateLiveLocation(tripId, { lat: nextLocation.latitude, lng: nextLocation.longitude, accuracy: nextLocation.accuracy }).catch(() => {})
      },
      (error) => { stopTracking(); setLocationError(friendlyLocationError(error)) },
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 },
    )
  }

  const startDemo = () => { setLocationError(''); setDemoTracking(true); setTracking(false) }
  const markCompleted = () => { setArrived(false); setRouteDeviation(false); setCompleted((current) => { const next = Math.min(current + 1, activities.length); if (next === activities.length) onComplete?.(); return next }) }
  const openGoogleMaps = () => {
    if (!nextPlace) return
    const origin = location ? `${location.latitude},${location.longitude}` : ''
    const destination = `${nextPlace.latitude},${nextPlace.longitude}`
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`, '_blank', 'noopener,noreferrer')
  }
  const requestReplan = async (trigger = 'USER_SKIPPED_ACTIVITY') => {
    setReplanning(true)
    try {
      const response = await replanItinerary({ trigger, currentLocation: location, currentItinerary: itinerary, remainingBudget: itinerary?.remainingBudget, availableTime: 'Today', userPreferences: tripData })
      setDecision(response.data?.decision || 'Your remaining route was reviewed for the current conditions.')
    } catch {
      setDecision('Demo AI kept the remaining route nearby and comfortable.')
    } finally { setReplanning(false) }
  }

  return <><GoogleMap location={location} nextDestination={nextPlace} itineraryPlaces={activities.map((activity) => indianPlaces.find((place) => place.id === activity.placeId))} /><main className="live-trip-page">
    <header className="live-trip-nav"><button className="site-brand" onClick={onBack}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><div><button onClick={onSafety}>🛡 Safety</button><button onClick={onAI}>✦ Bharat AI</button></div></header>
    <section className="live-trip-heading"><div><p className="home-eyebrow">LIVE TRIP · {itinerary?.destination || 'INDIA'}</p><h1>Travel with<br /><em>awareness.</em></h1><p>Location is used only while Live Trip is active. It is not publicly shared.</p></div><div className={`tracking-badge ${tracking || demoTracking ? 'on' : ''}`}><span /> {tracking ? 'LIVE LOCATION ON' : demoTracking ? 'DEMO LOCATION' : 'LOCATION OFF'}</div></section>
    <section className="live-trip-grid"><div className="live-map-panel"><div className="live-map-canvas"><span className="map-grid" /><div className="live-route-line" /><span className="live-map-pin user">●</span><span className="live-map-pin next">◆</span><span className="live-map-pin place-one">•</span><span className="live-map-pin place-two">•</span><div className="map-label user-label">{tracking || demoTracking ? 'YOU' : 'START'}</div><div className="map-label next-label">{nextPlace?.name || 'Next stop'}</div></div><div className="map-legend"><span><i className="legend-user" /> Current location</span><span><i className="legend-next" /> Next destination</span><span><i className="legend-route" /> Estimated route</span></div></div><aside className="live-trip-context"><p className="home-eyebrow">NEXT DESTINATION</p><h2>{nextPlace?.name || 'No destination yet'}</h2><p className="next-location">📍 {nextPlace ? `${nextPlace.city}, ${nextPlace.state}` : 'Add an itinerary activity'}</p><div className="next-metrics"><div><small>DISTANCE</small><b>{distance === null ? '—' : `${distance.toFixed(1)} km`}</b></div><div><small>EST. ETA</small><b>{distance === null ? '—' : `${Math.max(5, Math.round(distance * 7))} min`}</b></div></div><div className="tracking-status"><span className="status-dot" /> <b>{tracking ? 'Location Tracking ON' : demoTracking ? 'Demo Location active' : 'Location Tracking OFF'}</b><small>{timeAgo(location?.timestamp)}</small></div>{location && <p className="accuracy">Accuracy ±{Math.round(location.accuracy)}m · {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E</p>}{!tracking && !demoTracking ? <div className="location-actions"><button className="primary-action" onClick={allowLocation}>Allow Location</button><button className="demo-location-button" onClick={startDemo}>Start Demo Location</button></div> : <button className="stop-location-button" onClick={stopTracking}>Stop Location Tracking</button>}{locationError && <div className="location-error" role="alert">{locationError}<button onClick={startDemo}>Enter Location Manually / Demo</button></div>}</aside></section>
    <section className="live-trip-stats"><div><small>PLACES COMPLETED</small><strong>{completed} / {activities.length}</strong><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div><div><small>CURRENT ACTIVITY</small><strong>{activities[completed - 1]?.placeName || 'Getting started'}</strong></div><div><small>NEXT ACTIVITY</small><strong>{nextPlace?.name || 'Complete your plan'}</strong></div><div><small>BUDGET REMAINING</small><strong>₹{Number(itinerary?.remainingBudget || 0).toLocaleString('en-IN')}</strong></div></section>
    <section className="live-trip-lower"><div className="live-timeline"><div className="live-panel-heading"><div><p className="home-eyebrow">TODAY'S TIMELINE</p><h2>One day, in motion.</h2></div>{nextActivity && <button onClick={markCompleted}>✓ Mark as Completed</button>}</div>{activities.map((activity, index) => <div className={`live-activity ${index < completed ? 'done' : index === completed ? 'active' : ''}`} key={activity.placeId}><span className="activity-check">{index < completed ? '✓' : index + 1}</span><time>{activity.startTime}</time><div><h3>{activity.placeName}</h3><p>{activity.category} · ₹{activity.estimatedCost} · {activity.durationHours} hrs</p></div></div>)}</div><aside className="live-alert-panel"><p className="home-eyebrow">CONDITIONS · {weather?.mode === 'demo' ? 'DEMO DATA' : 'LIVE DATA'}</p><div className="live-condition"><span>☀</span><div><small>WEATHER</small><b>{weather ? `${weather.temperature}°C · ${weather.condition}` : 'Waiting for location'}</b><em>{weather ? `${weather.rainProbability}% rain probability` : 'Start Live Location to check weather'}</em></div></div><div className="live-condition"><span>🚗</span><div><small>TRAFFIC</small><b>{route?.trafficStatus || 'Waiting for route'}</b><em>{route ? `Normal ${route.normalDuration} · Current ${route.travelTime}` : 'Route estimate unavailable'}</em></div></div><div className="live-condition"><span>₹</span><div><small>TRIP BUDGET</small><b>₹{Number(itinerary?.remainingBudget || 0).toLocaleString('en-IN')} remaining</b><em>Smart budget monitoring</em></div></div><button className="replan-button" onClick={() => requestReplan('RAIN')}>{replanning ? '🤖 Replanning...' : '⚡ Recalculate Trip'}</button>{decision && <div className="live-decision"><b>Why did AI change my plan?</b><p>{decision}</p></div>}</aside></section>
  </main></>
}
