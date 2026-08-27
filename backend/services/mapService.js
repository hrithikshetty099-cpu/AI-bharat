export function getDemoRoute(origin, destination) {
  return { mode: 'demo', origin, destination, distance: '1.8 km', travelTime: '18 min', route: [], message: 'Connect a map provider to calculate live routes.' }
}

export async function getRoute(origin, destination) {
  if (!process.env.MAPBOX_ACCESS_TOKEN || typeof origin !== 'object' || typeof destination !== 'object') return getDemoRoute(origin, destination)
  const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`
  const params = new URLSearchParams({ access_token: process.env.MAPBOX_ACCESS_TOKEN, geometries: 'geojson', overview: 'full', annotations: 'duration' })
  const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?${params}`)
  if (!response.ok) throw new Error('Mapbox route request failed')
  const data = await response.json()
  const route = data.routes?.[0]
  if (!route) throw new Error('No route found')
  return { mode: 'live', origin, destination, distance: `${(route.distance / 1000).toFixed(1)} km`, travelTime: `${Math.round(route.duration / 60)} min`, normalDuration: `${Math.round(route.duration / 60)} min`, trafficStatus: 'Live route estimate', route: route.geometry?.coordinates || [] }
}
