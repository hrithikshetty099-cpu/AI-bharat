import { indianPlaces } from '../data/indianPlaces.js'

export function getAllPlaces() {
  return indianPlaces
}

export function getPlacesByState(state) {
  const normalizedState = state.trim().toLowerCase()
  return indianPlaces.filter((place) => place.state.toLowerCase() === normalizedState)
}

export function getPlacesByCity(city) {
  const normalizedCity = city.trim().toLowerCase()
  return indianPlaces.filter((place) => place.city.toLowerCase() === normalizedCity)
}

export function searchPlaces(searchTerm) {
  const normalizedTerm = searchTerm.trim().toLowerCase()
  if (!normalizedTerm) return indianPlaces

  return indianPlaces.filter((place) => [place.name, place.city, place.state, place.category, place.description]
    .some((value) => value.toLowerCase().includes(normalizedTerm)))
}

export function filterPlacesByInterest(interest) {
  const normalizedInterest = interest.trim().toLowerCase()
  return indianPlaces.filter((place) => place.interests.some((item) => item.toLowerCase() === normalizedInterest))
}

export function filterPlacesByBudget(maxCost) {
  const budget = Number(maxCost)
  if (!Number.isFinite(budget)) return []
  return indianPlaces.filter((place) => place.estimatedCost <= budget)
}
