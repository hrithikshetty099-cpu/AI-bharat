import { Router } from 'express'
import { cancelBooking, createDemoBooking, getBooking } from '../services/transportService.js'
import { getDemoBus } from '../services/transportService.js'

const router = Router()

router.post('/', (request, response) => {
  const { bus_id: busId, passenger_count: passengerCount, passengers } = request.body || {}
  const bus = getDemoBus(busId)
  if (!bus || !passengerCount || !Array.isArray(passengers) || passengers.length !== Number(passengerCount)) return response.status(400).json({ success: false, message: 'Valid bus and passenger details are required' })
  return response.status(201).json({ success: true, mode: 'demo', data: createDemoBooking(request.body) })
})

router.get('/:id', (request, response) => {
  const booking = getBooking(request.params.id)
  return booking ? response.json({ success: true, data: booking }) : response.status(404).json({ success: false, message: 'Booking not found' })
})

router.post('/:id/cancel', (request, response) => {
  const booking = cancelBooking(request.params.id)
  return booking ? response.json({ success: true, data: booking }) : response.status(404).json({ success: false, message: 'Booking not found' })
})

export default router
