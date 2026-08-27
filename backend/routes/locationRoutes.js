import { Router } from 'express'
import { normalizeLocation } from '../services/locationService.js'

const router = Router()
const currentLocations = new Map()

router.post('/update', (request, response) => {
  const location = normalizeLocation(request.body?.location)
  const tripId = String(request.body?.tripId || '').trim()
  if (!tripId || !location) return response.status(400).json({ success: false, message: 'A tripId and valid location are required' })
  currentLocations.set(tripId, { ...location, updatedAt: new Date().toISOString() })
  return response.json({ success: true, data: { tripId, ...currentLocations.get(tripId) } })
})

router.get('/current/:tripId', (request, response) => response.json({ success: true, data: currentLocations.get(request.params.tripId) || null }))
router.post('/stop', (request, response) => { currentLocations.delete(String(request.body?.tripId || '')); return response.json({ success: true, message: 'Location sharing stopped' }) })

export default router
