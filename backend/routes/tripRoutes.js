import { Router } from 'express'
import { indianPlaces } from '../../src/data/indianPlaces.js'
import { generateItinerary } from '../../src/services/itineraryService.js'
import { generateAIItinerary } from '../services/aiService.js'

const router = Router()

router.post('/generate', async (request, response) => {
  try {
    const { startingLocation, destination, days, budget, interests, travellers, travelStyle, transportation, foodPreference, travelDate, departureTime } = request.body ?? {}

    if (!destination || days === undefined || days === null || days === '' || budget === undefined || budget === null || budget === '') {
      return response.status(400).json({
        success: false,
        message: 'Destination, days and budget are required',
      })
    }

    const normalizedDestination = String(destination).trim().toLowerCase()
    const places = indianPlaces.filter((place) => [place.city, place.state, place.region, place.name]
      .some((value) => value.toLowerCase() === normalizedDestination || value.toLowerCase().includes(normalizedDestination)))

    if (!places.length) {
      return response.status(400).json({ success: false, message: `No Indian tourist places found for ${destination}` })
    }

    const tripData = { startingLocation, destination, days, budget, interests, travellers, travelStyle, transportation, foodPreference, travelDate, departureTime }
    const itinerary = await generateAIItinerary(tripData, places)

    return response.json({
      success: true,
      message: 'AI itinerary generated',
      data: itinerary,
    })
  } catch (error) {
    console.error('Trip generation request failed:', error.message)
    const tripData = request.body ?? {}
    try {
      const fallbackItinerary = generateItinerary(tripData)
      return response.json({
        success: true,
        mode: 'demo',
        message: 'AI service temporarily unavailable. Showing optimized demo mode.',
        data: fallbackItinerary,
      })
    } catch (fallbackError) {
      console.error('Demo itinerary fallback failed:', fallbackError.message)
      return response.status(500).json({ success: false, message: 'Unable to generate a trip from the supplied details' })
    }
  }
})

export default router
