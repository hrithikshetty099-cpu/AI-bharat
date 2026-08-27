const API_BASE_URL = 'http://localhost:5000'

export async function searchBuses({ from, to, date }) {
  const params = new URLSearchParams({ from, to, date })
  const response = await fetch(`${API_BASE_URL}/api/buses/search?${params}`)
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Bus search is unavailable.')
  return result
}

export async function createDemoBooking(booking) {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Booking could not be created.')
  return result
}
