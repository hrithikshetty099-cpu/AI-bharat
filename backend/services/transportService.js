const demoBuses = [
  { id: 'demo-bus-001', operator_name: 'Bharat Express Demo', bus_type: 'AC Seater', departure_time: '06:00 AM', arrival_time: '01:00 PM', duration: '7h', boarding_point: 'Mangaluru Central', dropping_point: 'Bengaluru Satellite Bus Stand', seat_availability: 'Demo seats', fare_per_passenger: 650, status: 'Demo Availability' },
  { id: 'demo-bus-002', operator_name: 'Southline Demo Coach', bus_type: 'Non-AC Seater', departure_time: '07:30 AM', arrival_time: '03:00 PM', duration: '7h 30m', boarding_point: 'Mangaluru Central', dropping_point: 'Majestic, Bengaluru', seat_availability: 'Demo seats', fare_per_passenger: 480, status: 'Demo Availability' },
]
const bookings = new Map()

export function searchDemoBuses({ from, to, date, passengers = 1 } = {}) {
  const requestedFrom = String(from || '').trim().toLowerCase()
  const requestedTo = String(to || '').trim().toLowerCase()
  return demoBuses
    .filter((bus) => !requestedFrom || bus.boarding_point.toLowerCase().includes(requestedFrom) || requestedFrom.includes('mangaluru'))
    .filter((bus) => !requestedTo || bus.dropping_point.toLowerCase().includes(requestedTo) || requestedTo.includes('bengaluru'))
    .map((bus) => ({ ...bus, requested_date: date || null, passengers: Number(passengers) || 1, total_fare: bus.fare_per_passenger * (Number(passengers) || 1) }))
}
export function getDemoBus(id) { return demoBuses.find((bus) => bus.id === id) }
export function createDemoBooking(input) {
  const booking = { booking_id: `DEMO-BOOKING-${String(bookings.size + 1).padStart(3, '0')}`, status: 'DEMO BOOKING', provider_booking_id: null, provider_ticket_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...input }
  bookings.set(booking.booking_id, booking)
  return booking
}
export function getBooking(id) { return bookings.get(id) }
export function cancelBooking(id) {
  const booking = bookings.get(id)
  if (!booking) return null
  const updated = { ...booking, status: 'CANCELLED', updated_at: new Date().toISOString() }
  bookings.set(id, updated)
  return updated
}
