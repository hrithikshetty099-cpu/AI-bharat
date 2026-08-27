import { useState } from 'react'
import { createDemoBooking } from '../services/transportService'

export default function BookingDetails({ tripData, bus, onBooked, onBack }) {
  const [passenger, setPassenger] = useState({ name: '', age: '', gender: 'Prefer not to say', phone: '', email: '' })
  const [error, setError] = useState('')
  const total = bus.fare_per_passenger * Number(tripData.travellers || 1) + 50
  const submit = async (event) => {
    event.preventDefault()
    if (!passenger.name || !passenger.phone) { setError('Passenger name and phone are required.'); return }
    try {
      const passengerCount = Number(tripData.travellers || 1)
      const passengers = Array.from({ length: passengerCount }, (_, index) => index === 0 ? passenger : { name: `Additional traveller ${index + 1}`, age: '', gender: 'Not provided' })
      const result = await createDemoBooking({ trip_id: `trip-${Date.now()}`, provider: 'BharatTrails Demo', operator_name: bus.operator_name, bus_id: bus.id, from: tripData.startingLocation, to: tripData.destination, travel_date: tripData.travelDate, departure_time: bus.departure_time, arrival_time: bus.arrival_time, passenger_count: passengerCount, passengers, fare_per_passenger: bus.fare_per_passenger, booking_fee: 50, total_amount: total, currency: 'INR' })
      onBooked(result.data)
    } catch (bookingError) { setError(bookingError.message) }
  }
  return <main className="booking-page"><header className="subpage-nav"><button className="site-brand" onClick={onBack}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><button className="back-link" onClick={onBack}>← Change bus</button></header><section className="booking-heading compact"><p className="home-eyebrow">STEP 03 / PASSENGER DETAILS</p><h1>Make it<br /><em>yours.</em></h1></section><section className="booking-layout"><div className="selected-bus"><span className="home-eyebrow">YOUR SELECTED BUS</span><h2>{bus.operator_name}</h2><p>{bus.bus_type} · {bus.departure_time} → {bus.arrival_time}</p><div>{tripData.startingLocation} <b>→</b> {tripData.destination}</div></div><form className="passenger-form" onSubmit={submit}><h2>Passenger details</h2><p>Used only to prepare this demo booking. No government ID is collected.</p><input placeholder="Full name *" value={passenger.name} onChange={(e) => setPassenger({ ...passenger, name: e.target.value })} /><div className="form-two"><input type="number" placeholder="Age" value={passenger.age} onChange={(e) => setPassenger({ ...passenger, age: e.target.value })} /><select value={passenger.gender} onChange={(e) => setPassenger({ ...passenger, gender: e.target.value })}><option>Prefer not to say</option><option>Female</option><option>Male</option></select></div><input placeholder="Phone number *" value={passenger.phone} onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })} /><input type="email" placeholder="Email (optional)" value={passenger.email} onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} />{error && <div className="booking-error">{error}</div>}<div className="booking-total"><span>₹{bus.fare_per_passenger} × {tripData.travellers || 1} + ₹50 fee<strong>Total payable</strong></span><b>₹{total.toLocaleString('en-IN')}</b></div><button className="primary-action" type="submit">Continue to booking <span>→</span></button></form></section></main>
}
