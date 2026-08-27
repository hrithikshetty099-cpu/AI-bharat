import { Router } from 'express'
import { indianPlaces } from '../../src/data/indianPlaces.js'
import { addExpense, getExpenses } from '../services/expenseService.js'
import { getDemoSafety } from '../services/safetyService.js'
import { getDemoWeather } from '../services/weatherService.js'

const router = Router()

router.get('/destinations', (_request, response) => response.json({ success: true, data: [...new Set(indianPlaces.map((place) => place.city))].sort() }))
router.get('/destinations/:id', (request, response) => {
  const place = indianPlaces.find((item) => item.id === request.params.id)
  if (!place) return response.status(404).json({ success: false, message: 'Indian destination not found' })
  return response.json({ success: true, data: place })
})
router.get('/places', (request, response) => {
  const query = String(request.query.search || '').toLowerCase()
  const places = indianPlaces.filter((place) => [place.name, place.city, place.state, place.region].some((value) => value.toLowerCase().includes(query)))
  response.json({ success: true, data: places })
})
router.get('/weather', (_request, response) => response.json({ success: true, data: getDemoWeather() }))
router.get('/safety', (_request, response) => response.json({ success: true, data: getDemoSafety() }))
router.get('/safety/nearby', (_request, response) => response.json({ success: true, data: getDemoSafety() }))
router.get('/places/nearby', (request, response) => response.json({ success: true, mode: 'demo', data: indianPlaces.slice(0, 5), origin: request.query.lat && request.query.lng ? { lat: request.query.lat, lng: request.query.lng } : null }))
router.post('/itinerary/generate', (request, response) => response.json({ success: true, mode: 'demo', message: 'Demo itinerary generation ready', data: request.body }))
router.post('/itinerary/replan', (request, response) => response.json({ success: true, mode: 'demo', message: 'Demo replanning decision ready', data: { decision: request.body.trigger === 'RAIN' ? 'Move outdoor stops later and bring an indoor museum forward.' : 'Keep the nearby route and protect the remaining budget.', changes: [{ trigger: request.body.trigger, reason: 'Demo condition evaluated against route distance, time, and comfort.' }], itinerary: request.body.currentItinerary || null } }))
router.post('/ai/chat', (request, response) => response.json({ success: true, mode: 'demo', data: { reply: 'I can help adjust your Indian journey around time, budget, weather, and energy.' }, context: request.body?.context || null }))
router.post('/expenses', (request, response) => {
  const { tripId = 'demo-trip', category, amount, description, date } = request.body || {}
  if (!category || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return response.status(400).json({ success: false, message: 'Category and a positive amount are required' })
  return response.status(201).json({ success: true, data: addExpense(tripId, { category, amount: Number(amount), description: description || '', date: date || new Date().toISOString().slice(0, 10) }) })
})
router.get('/expenses/:tripId', (request, response) => response.json({ success: true, data: getExpenses(request.params.tripId) }))

export default router
