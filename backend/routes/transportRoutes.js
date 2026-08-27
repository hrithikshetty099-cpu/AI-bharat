import { Router } from 'express'
import { createProviderBooking, getProviderBooking, isBusProviderConfigured, searchBuses } from '../services/busService.js'

const router = Router()
router.get('/search', async (request, response) => {
  if (!isBusProviderConfigured()) return response.status(503).json({ success: false, code: 'BUS_PROVIDER_UNAVAILABLE', message: 'Live bus availability is currently unavailable.' })
  try { return response.json({ success: true, mode: 'live', data: await searchBuses(request.query) }) } catch (error) { return response.status(502).json({ success: false, message: error.message }) }
})
router.get('/', (request, response) => response.redirect(307, `/api/buses/search?${new URLSearchParams(request.query).toString()}`))
router.post('/', async (request, response) => {
  if (!isBusProviderConfigured()) return response.status(503).json({ success: false, code: 'BUS_PROVIDER_UNAVAILABLE', message: 'Live bus booking is temporarily unavailable.' })
  try { return response.status(201).json({ success: true, mode: 'live', data: await createProviderBooking(request.body) }) } catch (error) { return response.status(502).json({ success: false, message: error.message }) }
})
router.get('/:id', (request, response) => { const booking = getProviderBooking(request.params.id); return booking ? response.json({ success: true, data: booking }) : response.status(404).json({ success: false, message: 'Booking not found' }) })
router.get('/booking/:id', (request, response) => {
  const booking = getBooking(request.params.id)
  return booking ? response.json({ success: true, data: booking }) : response.status(404).json({ success: false, message: 'Booking not found' })
})
router.post('/booking/:id/cancel', (request, response) => {
  const booking = cancelBooking(request.params.id)
  return booking ? response.json({ success: true, data: booking }) : response.status(404).json({ success: false, message: 'Booking not found' })
})

export default router
