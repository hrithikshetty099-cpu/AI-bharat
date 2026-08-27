const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function generateTrip(tripData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trip/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    })

    let result
    try {
      result = await response.json()
    } catch {
      throw new Error('The travel server returned an invalid response.')
    }

    if (!response.ok) {
      const error = new Error(result.message || 'The travel server could not process your request.')
      error.status = response.status
      throw error
    }

    return result
  } catch (error) {
    if (error.status) throw error
    throw new Error('Unable to connect to the travel server. Please make sure the backend is running.')
  }
}
