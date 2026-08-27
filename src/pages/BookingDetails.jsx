import { useState } from 'react'
import { createDemoBooking } from '../services/transportService'

export default function BookingDetails({ tripData, bus, onBooked, onBack }) {
  const [passenger, setPassenger] = useState({ name: '', age: '', gender: 'Prefer not to say', phone: '', email: '' })
  const [error, setError] = useState('')
  const passengerCount = Number(tripData.travellers || 1)
  const fare = Number(bus.fare || 0)
  const taxes = Number(bus.taxes || 0)
  const total = fare * passengerCount + taxes
  const [selectedSeats, setSelectedSeats] = useState([])
  const submit = async (event) => {
    event.preventDefault()
    if (!passenger.name || !passenger.phone) { setError('Passenger name and phone are required.'); return }
    try {
      const passengers = Array.from({ length: passengerCount }, (_, index) => index === 0 ? passenger : { name: `Additional traveller ${index + 1}`, age: '', gender: 'Not provided' })
      const result = await createDemoBooking({ trip_id: `trip-${Date.now()}`, provider: bus.provider, bus_id: bus.id, from: tripData.startingLocation, to: tripData.destination, travel_date: tripData.travelDate, departure: bus.departure, arrival: bus.arrival, passenger_count: passengerCount, passengers, selectedSeats, ticketPrice: fare, taxes, totalAmount: total })
      onBooked(result.data)
    } catch (bookingError) { setError(bookingError.message) }
  }
  return <main className="booking-page"><header className="subpage-nav"><button className="site-brand" onClick={onBack}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><button className="back-link" onClick={onBack}>← Change bus</button></header><section className="booking-heading compact"><p className="home-eyebrow">STEP 03 / PASSENGER DETAILS</p><h1>Make it<br /><em>yours.</em></h1></section><section className="booking-layout"><div className="selected-bus"><span className="home-eyebrow">YOUR SELECTED BUS</span><h2>{bus.operator}</h2><p>{bus.busType} · {bus.departure} → {bus.arrival}</p><div>{tripData.startingLocation} <b>→</b> {tripData.destination}</div>{bus.seats?.length > 0 && <div className="seat-map"><b>Select {passengerCount} seat{passengerCount > 1 ? 's' : ''}</b>{bus.seats.map((seat) => <button type="button" className={selectedSeats.includes(seat.id) ? 'selected' : seat.booked ? 'booked' : ''} disabled={seat.booked || (!selectedSeats.includes(seat.id) && selectedSeats.length >= passengerCount)} onClick={() => setSelectedSeats((current) => current.includes(seat.id) ? current.filter((id) => id !== seat.id) : [...current, seat.id])} key={seat.id}>{seat.label || seat.id}</button>)}</div>}</div><form className="passenger-form" onSubmit={submit}><h2>Passenger details</h2><p>Booking is completed only after the configured provider confirms it.</p><input placeholder="Full name *" value={passenger.name} onChange={(e) => setPassenger({ ...passenger, name: e.target.value })} /><div className="form-two"><input type="number" placeholder="Age" value={passenger.age} onChange={(e) => setPassenger({ ...passenger, age: e.target.value })} /><select value={passenger.gender} onChange={(e) => setPassenger({ ...passenger, gender: e.target.value })}><option>Prefer not to say</option><option>Female</option><option>Male</option></select></div><input placeholder="Phone number *" value={passenger.phone} onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })} /><input type="email" placeholder="Email (optional)" value={passenger.email} onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} />{error && <div className="booking-error">{error}</div>}<div className="booking-total"><span>Base fare ₹{fare.toLocaleString('en-IN')} × {passengerCount} + taxes ₹{taxes.toLocaleString('en-IN')}<strong>Total payable</strong></span><b>₹{total.toLocaleString('en-IN')}</b></div><button className="primary-action" type="submit" disabled={bus.seats?.length > 0 && selectedSeats.length !== passengerCount}>Book with provider <span>→</span></button></form></section></main>
}
