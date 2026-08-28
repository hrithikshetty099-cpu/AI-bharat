import { GoogleGenerativeAI } from '@google/generative-ai';
import { indianPlaces } from '../data/indianPlaces.js';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || 'AIzaSyCh0nsLWCYaip_42pS6oxNfGSGQONX9Kus');

export async function generateTrip(tripData) {
  try {
    const normalizedDestination = String(tripData.destination).trim().toLowerCase();
    const places = indianPlaces.filter((place) => 
      [place.city, place.state, place.region, place.name].some((value) => 
        value.toLowerCase() === normalizedDestination || value.toLowerCase().includes(normalizedDestination)
      )
    );
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
You are the AI Bharat Travel itinerary planner.
Create a highly practical and realistic day-by-day travel itinerary for the destination: "${tripData.destination}".
${places.length > 0 ? `Here is some local reference data for attractions: ${JSON.stringify(places)}` : ''}

Instructions:
1. Generate real, popular tourist attractions/activities for "${tripData.destination}".
2. You MUST provide accurate latitude and longitude coordinates (decimal numbers) for each attraction so they can be plotted on Google Maps (e.g. Bengaluru Palace is approx 12.9980, 77.5921). Double-check coordinate accuracy.
3. Distribute activities naturally across the requested ${tripData.days} days.
4. Calculate costs in INR and keep totals within the user's budget of ₹${tripData.budget}.
5. Return JSON ONLY matching this top-level structure:
{
  "destination": "${tripData.destination}",
  "days": ${tripData.days},
  "totalEstimatedCost": number,
  "remainingBudget": number,
  "warning": string,
  "dailyPlans": [
    {
      "day": number,
      "activities": [
        {
          "placeId": string (unique identifier, e.g. "bengaluru-palace"),
          "placeName": string,
          "startTime": string (e.g. "09:00"),
          "endTime": string (e.g. "11:30"),
          "estimatedCost": number,
          "category": string,
          "latitude": number,
          "longitude": number,
          "reason": string
        }
      ]
    }
  ],
  "budgetSummary": string,
  "travelTips": string
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsedData = JSON.parse(text);
    return { success: true, data: parsedData };
  } catch (error) {
    console.error('Gemini trip generation failed:', error);
    throw error;
  }
}

export async function askBharatAI(message, context = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are Bharat AI, a virtual assistant helping a tourist travel in India.
Answer the user's question, keeping in mind local conditions, weather, safety, and budget.
Keep your response warm, friendly, concise, and helpful (max 2-3 sentences).

User Question: "${message}"
Context: ${JSON.stringify(context)}
`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();
    return { success: true, data: { reply } };
  } catch (error) {
    console.error('Gemini chat failed:', error);
    throw error;
  }
}
