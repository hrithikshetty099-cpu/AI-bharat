import { touristPlaces } from '../../src/data/indiaDestinations.js'

const aliases = { waterfall: 'Waterfall', waterfalls: 'Waterfall', beach: 'Beach', beaches: 'Beach', historical: 'Heritage', history: 'Heritage', nature: 'Nature', wildlife: 'Wildlife', spiritual: 'Spiritual', adventure: 'Adventure', family: 'Family' }
const radians = (value) => value * Math.PI / 180
const distance = (from, place) => {
  if (!from || !Number.isFinite(Number(from.latitude)) || !Number.isFinite(Number(from.longitude))) return null
  const deltaLat = radians(place.latitude - from.latitude)
  const deltaLng = radians(place.longitude - from.longitude)
  const lat = radians(Number(from.latitude))
  const target = radians(place.latitude)
  const value = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat) * Math.cos(target) * Math.sin(deltaLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

export function recommendDestinations(input = {}) {
  const query = String(input.query || '').toLowerCase().replace(/mangalore/g, 'mangaluru').replace(/mysore/g, 'mysuru').replace(/chikmagalur/g, 'chikkamagaluru')
  const interests = [...(input.interests || []), ...Object.keys(aliases).filter((key) => query.includes(key)).map((key) => aliases[key])]
  const budget = Number(input.budget)
  const hours = Number(input.hoursAvailable || (Number(input.days) || 1) * 8)
  const origin = input.startingLocation && typeof input.startingLocation === 'object' ? input.startingLocation : null
  const requestedState = String(input.state || '').trim().toLowerCase()
  const requestedDistrict = String(input.district || '').trim().toLowerCase()
  const mentionedState = touristPlaces.find((place) => query.includes(place.state.toLowerCase()))?.state.toLowerCase()
  const mentionedDistrict = touristPlaces.find((place) => query.includes(place.district.toLowerCase()) || query.includes(place.city.toLowerCase()))?.district.toLowerCase()
  const state = requestedState || mentionedState
  const district = requestedDistrict || mentionedDistrict
  const stateCandidates = touristPlaces.filter((place) => !state || place.state.toLowerCase() === state)
  const districtCandidates = stateCandidates.filter((place) => !district || place.district.toLowerCase() === district)
  const requestedInterests = [...new Set(interests)].map((interest) => String(interest).toLowerCase())
  const districtHasMatch = districtCandidates.some((place) => requestedInterests.some((interest) => [place.category, ...(place.tags || [])].map((tag) => tag.toLowerCase()).includes(interest)))
  const candidates = district && requestedInterests.length && !districtHasMatch ? stateCandidates : districtCandidates
  return candidates.map((place) => {
    const interestHits = [...new Set(interests)].filter((interest) => (place.tags || []).map((tag) => tag.toLowerCase()).includes(String(interest).toLowerCase())).length
    const interestScore = interests.length ? Math.min(30, interestHits / interests.length * 30) : 18
    const budgetScore = Number.isFinite(budget) ? (place.entryFee <= budget ? 20 : 0) : 12
    const km = distance(origin, place)
    const distanceScore = km === null ? 10 : Math.max(0, 15 - Math.min(15, km / 10))
    const timeScore = place.estimatedVisitDuration <= hours ? 15 : 5
    const score = Math.round(interestScore + budgetScore + distanceScore + timeScore + 10 + 5 + 5)
    const reasons = []
    if (interestHits) reasons.push(`Matches your ${[...new Set(interests)].join(' and ')} preference`)
    if (!Number.isFinite(budget) || place.entryFee <= budget) reasons.push(`Fits your ${Number.isFinite(budget) ? `₹${budget.toLocaleString('en-IN')} ` : ''}budget`)
    if (place.estimatedVisitDuration <= hours) reasons.push('Fits your available time')
    reasons.push('Verified destination data is available')
    return { rank: 0, destination: place, matchScore: Math.min(100, score), reasons, estimatedCost: place.entryFee, estimatedTravelTime: km === null ? 'Information unavailable' : `${Math.max(20, Math.round(km * 2.2))} min` }
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 12).map((item, index) => ({ ...item, rank: index + 1 }))
}
