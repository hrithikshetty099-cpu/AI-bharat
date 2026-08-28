import { generateTrip as generateGeminiTrip } from './geminiService'

export async function generateTrip(tripData) {
  return generateGeminiTrip(tripData)
}

