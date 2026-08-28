const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
import { askBharatAI as askGeminiBharatAI } from './geminiService'


async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Live travel service unavailable.')
  return result
}

export function replanItinerary(payload) {
  return request('/api/itinerary/replan', { method: 'POST', body: JSON.stringify(payload) })
}

export function getDemoWeather({ lat, lng } = {}) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
  return request(`/api/travel/weather?${params}`)
}

export function getRoute(origin, destination) {
  return request('/api/travel/route', { method: 'POST', body: JSON.stringify({ origin, destination }) })
}

export function getNearbySafety() {
  return request('/api/safety/nearby')
}

export function updateLiveLocation(tripId, location) {
  return request('/api/location/update', { method: 'POST', body: JSON.stringify({ tripId, location }) })
}

export function stopLiveLocation(tripId) {
  return request('/api/location/stop', { method: 'POST', body: JSON.stringify({ tripId }) })
}

export function askBharatAI(message, context) {
  return askGeminiBharatAI(message, context)
}

export function addTripExpense(expense) {
  return request('/api/expenses', { method: 'POST', body: JSON.stringify(expense) })
}

export function getTripExpenses(tripId) {
  return request(`/api/expenses/${encodeURIComponent(tripId)}`)
}

export function requestBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location is not supported by this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, () => reject(new Error('Location permission was not granted.')), { enableHighAccuracy: true, timeout: 10000 })
  })
}
