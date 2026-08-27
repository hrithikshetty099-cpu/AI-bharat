import TripPlanner from './pages/TripPlanner'
import Itinerary from './pages/Itinerary'
import Home from './pages/Home'
import Explore from './pages/Explore'
import LiveMode from './pages/LiveMode'
import LiveTrip from './pages/LiveTrip'
import SafetyCenter from './pages/SafetyCenter'
import BharatAI from './components/BharatAI'
import BusSearch from './pages/BusSearch'
import BookingDetails from './pages/BookingDetails'
import BookingConfirmation from './pages/BookingConfirmation'
import { getAllPlaces, getPlacesByCity } from './services/placeService'
import { generateItinerary } from './services/itineraryService'
import { generateTrip } from './services/apiService'
import { useState } from 'react'

console.log(getAllPlaces())
console.log(getPlacesByCity('Mysuru'))

export default function App() {
  const [page, setPage] = useState('home')
  const [itinerary, setItinerary] = useState(null)
  const [serverResponse, setServerResponse] = useState(null)
  const [tripData, setTripData] = useState(null)
  const [showAI, setShowAI] = useState(false)
  const [pendingTrip, setPendingTrip] = useState(null)
  const [selectedBus, setSelectedBus] = useState(null)
  const [booking, setBooking] = useState(null)

  const handleGenerate = async (tripData) => {
    try {
      const response = await generateTrip(tripData)
      setTripData(tripData)
      setServerResponse(response)
      const fallbackItinerary = generateItinerary(tripData)
      const generatedItinerary = response?.data?.dailyPlans ? response.data : fallbackItinerary
      setItinerary(generatedItinerary)
      return true
    } catch (error) {
      if (error.status === 400) throw error
      // Keep the hackathon demo usable when the backend or AI provider is offline.
      setServerResponse({ success: false, message: 'Demo AI mode activated', data: tripData })
      setTripData(tripData)
      setItinerary(generateItinerary(tripData))
      return true
    }
  }

  const launchDemo = () => {
    handleGenerate({ startingLocation: 'Mangaluru', destination: 'Bengaluru', days: 1, budget: 2500, interests: ['History', 'Food'], travellers: 2, travelStyle: 'Balanced', transportation: 'Bus', foodPreference: 'Vegetarian', departureTime: '06:00', travelDate: new Date().toISOString().split('T')[0] })
  }

  const handlePlanSubmit = async (trip) => {
    setPendingTrip(trip)
    setPage('buses')
    return true
  }

  const handleBooking = (createdBooking) => {
    setBooking(createdBooking)
    setPage('booking-confirmation')
  }

  const generateBookedTrip = () => {
    const bookedTrip = { ...pendingTrip, budget: Math.max(1, Number(pendingTrip.budget) - Number(booking?.total_amount || 0)) }
    setTripData({ ...pendingTrip, busCost: Number(booking?.total_amount || 0) })
    setServerResponse({ success: false, message: 'Demo Booking', data: pendingTrip })
    setItinerary(generateItinerary(bookedTrip))
  }

  if (itinerary && page !== 'live') return <><Itinerary itinerary={itinerary} serverResponse={serverResponse} tripData={tripData} onBack={() => { setItinerary(null); setPage('plan') }} onLive={() => setPage('live')} /><button className="floating-ai" onClick={() => setShowAI(true)}>✦ <span>Bharat AI</span></button>{showAI && <BharatAI onClose={() => setShowAI(false)} />}</>
  if (page === 'explore') return <Explore onPlan={() => setPage('plan')} />
  if (page === 'buses') return <BusSearch tripData={pendingTrip} onSelect={(bus) => { setSelectedBus(bus); setPage('booking') }} onBack={() => setPage('plan')} />
  if (page === 'booking') return <BookingDetails tripData={pendingTrip} bus={selectedBus} onBooked={handleBooking} onBack={() => setPage('buses')} />
  if (page === 'booking-confirmation') return <BookingConfirmation booking={booking} onGenerate={generateBookedTrip} onBack={() => setPage('plan')} />
  if (page === 'live') return <><LiveTrip itinerary={itinerary || generateItinerary({ destination: 'Mysuru', days: 1, budget: 2000, interests: ['History'], travellers: 1 })} tripData={tripData} onBack={() => setPage(itinerary ? 'plan' : 'home')} onSafety={() => setPage('safety')} onAI={() => setShowAI(true)} />{showAI && <BharatAI onClose={() => setShowAI(false)} />}</>
  if (page === 'safety') return <SafetyCenter onBack={() => setPage('home')} />
  if (page === 'plan') return <TripPlanner onGenerate={handlePlanSubmit} />
  return <><Home onPlan={() => setPage('plan')} onExplore={() => setPage('explore')} onLive={() => setPage('live')} onSafety={() => setPage('safety')} onAI={() => setShowAI(true)} onDemo={launchDemo} />{showAI && <BharatAI onClose={() => setShowAI(false)} />}</>
}
