import dotenv from 'dotenv'
import OpenAI from 'openai'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

function createClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured on the backend.')
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function validateAIPlaces(itinerary, places) {
  const allowedIds = new Set(places.map((place) => place.id))
  const allowedNames = new Set(places.map((place) => place.name))

  for (const day of itinerary.dailyPlans ?? []) {
    for (const activity of day.activities ?? []) {
      if (activity.placeId && !allowedIds.has(activity.placeId)) {
        throw new Error('AI returned a place outside the supplied Indian tourist-place dataset.')
      }
      if (activity.placeName && !allowedNames.has(activity.placeName)) {
        throw new Error('AI returned an unknown tourist place.')
      }
    }
  }
}

export async function generateAIItinerary(tripData, places) {
  if (!Array.isArray(places) || places.length === 0) {
    throw new Error('No Indian tourist places are available for this destination.')
  }

  const client = createClient()
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: [
          'You are the AI Bharat Travel itinerary planner.',
          'Create a practical itinerary only from the supplied places data.',
          'Never invent, rename, or substitute a tourist place.',
          'Keep attraction costs within the requested INR budget as reasonably as possible.',
          'Return valid JSON only. Do not wrap it in markdown.',
          'Use this exact top-level shape: destination, days, totalEstimatedCost, remainingBudget, warning, dailyPlans, budgetSummary, travelTips.',
          'dailyPlans must be an array of { day, activities }, and each activity must contain placeId, placeName, startTime, endTime, estimatedCost, category, reason.',
        ].join(' '),
      },
      {
        role: 'user',
        content: JSON.stringify({ tripData, availablePlaces: places }),
      },
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('The AI itinerary response was empty.')

  let itinerary
  try {
    itinerary = JSON.parse(content)
  } catch {
    throw new Error('The AI itinerary response was not valid JSON.')
  }

  validateAIPlaces(itinerary, places)
  return itinerary
}
