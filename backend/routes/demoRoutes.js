import { Router } from 'express'
import { indianPlaces } from '../../src/data/indianPlaces.js'
import { addExpense, getExpenses } from '../services/expenseService.js'
import { getDemoSafety } from '../services/safetyService.js'
import { getDemoWeather, getWeather } from '../services/weatherService.js'
import { getDemoRoute, getRoute } from '../services/mapService.js'
import { recommendDestinations } from '../services/recommendationService.js'
import { states as indiaStates, touristPlaces } from '../../src/data/indiaDestinations.js'

const router = Router()

router.get('/destinations', (request, response) => {
  const { state, district, category, search, minBudget, maxBudget, familyFriendly, official, page = 1, limit = 24 } = request.query
  const searchTerms = String(search || '').toLowerCase().replace(/mangalore/g, 'mangaluru').split(/\s+/).filter((term) => term.length > 2 && !['near', 'places', 'visit', 'best', 'under', 'from', 'one', 'day', 'trip'].includes(term))
  const places = touristPlaces.filter((place) => (!state || place.state.toLowerCase() === String(state).toLowerCase()) && (!district || place.district.toLowerCase() === String(district).toLowerCase()) && (!category || [place.category, ...(place.tags || [])].some((value) => value.toLowerCase() === String(category).toLowerCase())) && (!familyFriendly || place.familyFriendly) && (!minBudget || (place.entryFeeIndian !== null && place.entryFeeIndian >= Number(minBudget))) && (!maxBudget || (place.entryFeeIndian !== null && place.entryFeeIndian <= Number(maxBudget))) && (!official || place.verificationStatus === 'OFFICIAL_VERIFIED' || place.verificationStatus === 'OFFICIAL_SOURCE_LISTED') && (!searchTerms.length || searchTerms.some((term) => [place.name, place.state, place.district, place.city, place.category, place.description, ...(place.tags || [])].join(' ').toLowerCase().includes(term))))
  const pageNumber = Math.max(1, Number(page) || 1)
  const pageSize = Math.min(60, Math.max(1, Number(limit) || 24))
  const start = (pageNumber - 1) * pageSize
  return response.json({ success: true, data: places.slice(start, start + pageSize), meta: { count: places.length, page: pageNumber, limit: pageSize, pages: Math.ceil(places.length / pageSize), supportedScope: 'India-only catalogued destinations' } })
})
router.get('/states', (_request, response) => response.json({ success: true, data: indiaStates, meta: { populatedStates: [...new Set(touristPlaces.map((place) => place.state))].length } }))
router.get('/states/:stateId/districts', (request, response) => response.json({ success: true, data: [...new Set(touristPlaces.filter((place) => place.state.toLowerCase() === request.params.stateId.toLowerCase()).map((place) => place.district))].sort() }))
router.get('/districts/:districtId/destinations', (request, response) => response.json({ success: true, data: touristPlaces.filter((place) => place.district.toLowerCase() === request.params.districtId.toLowerCase()) }))
router.get('/destinations/official', (_request, response) => response.json({ success: true, data: touristPlaces.filter((place) => place.verificationStatus === 'OFFICIAL_VERIFIED' || place.verificationStatus === 'OFFICIAL_SOURCE_LISTED') }))
router.get('/destinations/search', (request, response) => {
  const query = String(request.query.q || '').toLowerCase()
  const data = touristPlaces.filter((place) => [place.name, place.state, place.district, place.city, place.category, ...(place.tags || [])].join(' ').toLowerCase().includes(query))
  return response.json({ success: true, data, meta: { count: data.length, query } })
})
router.get('/destinations/:id', (request, response) => {
  const place = touristPlaces.find((item) => item.id === request.params.id)
  if (!place) return response.status(404).json({ success: false, message: 'Indian destination not found' })
  return response.json({ success: true, data: place })
})
router.get('/places', (request, response) => {
  const query = String(request.query.search || '').toLowerCase()
  const places = indianPlaces.filter((place) => [place.name, place.city, place.state, place.region].some((value) => value.toLowerCase().includes(query)))
  response.json({ success: true, data: places })
})
router.post('/ai/recommend-destinations', (request, response) => response.json({ success: true, mode: 'transparent-ranking', data: recommendDestinations(request.body) }))
router.get('/weather', (_request, response) => response.json({ success: true, data: getDemoWeather() }))
router.get('/travel/weather', async (request, response) => {
  const { lat, lng } = request.query
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return response.status(400).json({ success: false, message: 'lat and lng are required' })
  try {
    const data = await getWeather(lat, lng)
    return response.json({ success: true, mode: data.mode, ...(data.mode === 'demo' ? { notice: 'DEMO WEATHER' } : {}), data: { ...data, coordinates: { lat: Number(lat), lng: Number(lng) } } })
  } catch { return response.json({ success: true, mode: 'demo', notice: 'DEMO WEATHER', data: { ...getDemoWeather(), coordinates: { lat: Number(lat), lng: Number(lng) } } }) }
})
router.post('/travel/route', async (request, response) => {
  const { origin, destination } = request.body || {}
  if (!origin || !destination) return response.status(400).json({ success: false, message: 'origin and destination are required' })
  try {
    const data = await getRoute(origin, destination)
    return response.json({ success: true, mode: data.mode, ...(data.mode === 'demo' ? { notice: 'DEMO TRAFFIC' } : {}), data: data.mode === 'demo' ? { ...data, normalDuration: '15 min', trafficStatus: 'Demo traffic estimate' } : data })
  } catch { return response.json({ success: true, mode: 'demo', notice: 'DEMO TRAFFIC', data: { ...getDemoRoute(origin, destination), normalDuration: '15 min', trafficStatus: 'Demo traffic estimate' } }) }
})
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
