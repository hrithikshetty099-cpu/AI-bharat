export function normalizeLocation(location) {
  if (!location || !Number.isFinite(Number(location.lat)) || !Number.isFinite(Number(location.lng))) return null
  return { lat: Number(location.lat), lng: Number(location.lng), accuracy: location.accuracy ? Number(location.accuracy) : null }
}
