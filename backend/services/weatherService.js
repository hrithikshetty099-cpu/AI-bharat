export function getDemoWeather() {
  return { mode: 'demo', temperature: 27, feelsLike: 28, condition: 'Clear skies', rainProbability: 12, wind: '8 km/h', humidity: 58, forecast: 'Comfortable for exploring', alerts: [] }
}

export async function getWeather(lat, lng) {
  if (!process.env.OPENWEATHER_API_KEY) return getDemoWeather()
  const params = new URLSearchParams({ lat: String(lat), lon: String(lng), appid: process.env.OPENWEATHER_API_KEY, units: 'metric' })
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)
  if (!response.ok) throw new Error('OpenWeather request failed')
  const data = await response.json()
  return { mode: 'live', temperature: Math.round(data.main.temp), feelsLike: Math.round(data.main.feels_like), condition: data.weather?.[0]?.description || 'Current conditions', rainProbability: data.rain ? 100 : 0, wind: `${Math.round(data.wind?.speed * 3.6 || 0)} km/h`, humidity: data.main.humidity, forecast: 'Live OpenWeather conditions', alerts: [] }
}
