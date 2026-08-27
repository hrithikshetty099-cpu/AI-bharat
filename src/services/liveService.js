const API_BASE_URL = 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Live travel service unavailable.')
  return result
}

export function replanItinerary(payload) {
  return request('/api/itinerary/replan', { method: 'POST', body: JSON.stringify(payload) })
}

export function getDemoWeather() {
  return request('/api/weather')
}

export function getNearbySafety() {
  return request('/api/safety/nearby')
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
