const bookings = new Map()

function providerConfigured() {
  return Boolean(process.env.BUS_API_BASE_URL && process.env.BUS_API_KEY && !process.env.BUS_API_KEY.startsWith('YOUR_'))
}

function unavailableError() {
  const error = new Error('Live bus availability is currently unavailable.')
  error.code = 'BUS_PROVIDER_UNAVAILABLE'
  return error
}

async function providerRequest(path, options = {}) {
  if (!providerConfigured()) throw unavailableError()
  const response = await fetch(`${process.env.BUS_API_BASE_URL.replace(/\/$/, '')}${path}`, { ...options, headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-Key': process.env.BUS_API_KEY, ...options.headers } })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.message || 'Bus provider request failed.')
  return result
}

function normalizeBus(bus) {
  return { id: bus.id || bus.busId || bus.service_id, operator: bus.operator || bus.operator_name || bus.operatorName || 'Information unavailable', busName: bus.busName || bus.name || 'Information unavailable', busType: bus.busType || bus.bus_type || 'Information unavailable', departure: bus.departure || bus.departure_time || 'Information unavailable', arrival: bus.arrival || bus.arrival_time || 'Information unavailable', duration: bus.duration || 'Information unavailable', boarding: bus.boarding || bus.boarding_point || 'Information unavailable', dropping: bus.dropping || bus.dropping_point || 'Information unavailable', availableSeats: bus.availableSeats ?? bus.available_seats ?? null, fare: bus.fare ?? bus.fare_per_passenger ?? null, taxes: bus.taxes ?? null, ac: bus.ac ?? null, sleeper: bus.sleeper ?? null, rating: bus.rating ?? null, cancellationPolicy: bus.cancellationPolicy || bus.cancellation_policy || 'Information unavailable', seats: Array.isArray(bus.seats) ? bus.seats : [], providerData: bus }
}

export async function searchBuses({ from, to, date, passengers = 1 }) {
  const params = new URLSearchParams({ from: String(from || ''), to: String(to || ''), date: String(date || ''), passengers: String(passengers) })
  const result = await providerRequest(`/buses/search?${params}`)
  const buses = Array.isArray(result) ? result : result.data || result.buses || []
  return buses.map(normalizeBus)
}

export async function createProviderBooking(input) {
  const result = await providerRequest('/buses/bookings', { method: 'POST', body: JSON.stringify(input) })
  const booking = result.data || result.booking || result
  const normalized = { id: booking.id || booking.bookingId, bookingReference: booking.bookingReference || booking.reference || null, provider: process.env.BUS_API_BASE_URL, busOperator: booking.busOperator || booking.operator, route: booking.route, journeyDate: booking.journeyDate || booking.date, departureTime: booking.departureTime || booking.departure, arrivalTime: booking.arrivalTime || booking.arrival, passengerCount: booking.passengerCount || input.passengers?.length, selectedSeats: booking.selectedSeats || input.selectedSeats || [], ticketPrice: booking.ticketPrice ?? booking.fare ?? null, taxes: booking.taxes ?? null, totalAmount: booking.totalAmount ?? booking.total ?? null, status: booking.status || 'PENDING', bookingUrl: booking.bookingUrl || null, raw: booking }
  bookings.set(normalized.id || normalized.bookingReference, normalized)
  return normalized
}

export function getProviderBooking(id) { return bookings.get(id) || null }
export function isBusProviderConfigured() { return providerConfigured() }
