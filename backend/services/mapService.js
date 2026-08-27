export function getDemoRoute(origin, destination) {
  return { mode: 'demo', origin, destination, distance: '1.8 km', travelTime: '18 min', route: [], message: 'Connect a map provider to calculate live routes.' }
}
