const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Destination service unavailable.')
  return result
}

export function getDestinations(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => { if (value !== '' && value !== false && value !== undefined) params.set(key, String(value)) })
  return request(`/api/destinations?${params}`)
}

export function getDestination(id) {
  return request(`/api/destinations/${encodeURIComponent(id)}`)
}

export function getStates() { return request('/api/states') }
export function getStateDistricts(state) { return request(`/api/states/${encodeURIComponent(state)}/districts`) }
export function getOfficialDestinations() { return request('/api/destinations/official') }