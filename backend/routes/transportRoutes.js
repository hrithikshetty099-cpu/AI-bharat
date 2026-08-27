import { Router } from 'express'
import { cancelBooking, createDemoBooking, getBooking, getDemoBus, searchDemoBuses } from '../services/transportService.js'

const router = Router()
router.get('/search', (request, response) => response.json({ success: true, mode: 'demo', data: searchDemoBuses(request.query) }))
router.get('/:id', (request, response) => {
  const bus = getDemoBus(request.params.id)
  return bus ? response.json({ success: true, mode: 'demo', data: bus }) : response.status(404).json({ success: false, message: 'Bus not found' })
})
router.post('/', (request, response) => {
  const { bus_id: busId, passenger_count: passengerCount, passengers } = request.body || {}
  const bus = getDemoBus(busId)
  if (!bus || !passengerCount || !Array.isArray(passengers) || passengers.length !== Number(passengerCount)) return response.status(400).json({ success: false, message: 'Valid bus and passenger details are required' })
  return response.status(201).json({ success: true, mode: 'demo', data: createDemoBooking(request.body) })
})
router.get('/booking/:id', (request, response) => {
  const booking = getBooking(request.params.id)
  return booking ? response.json({ success: true, data: booking }) : response.status(404).json({ success: false, message: 'Booking not found' })
})
router.post('/booking/:id/cancel', (request, response) => {
  const booking = cancelBooking(request.params.id)
  return booking ? response.json({ success: true, data: booking }) : response.status(404).json({ success: false, message: 'Booking not found' })
})

export default router
