import { indianPlaces } from '../data/indianPlaces.js'
import { getPlacesByCity } from './placeService.js'

const ACTIVITY_START_MINUTES = 9 * 60
const DAY_ACTIVITY_MINUTES = 8 * 60
const TRAVEL_GAP_MINUTES = 30

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function validateTripData(tripData) {
  if (!tripData || typeof tripData !== 'object') throw new Error('Please provide valid trip details.')
  if (!tripData.destination || !String(tripData.destination).trim()) throw new Error('Choose a destination before generating your itinerary.')
  if (!Number.isInteger(Number(tripData.days)) || Number(tripData.days) < 1 || Number(tripData.days) > 30) throw new Error('Your trip must be between 1 and 30 days.')
  if (!Number.isFinite(Number(tripData.budget)) || Number(tripData.budget) <= 0) throw new Error('Please enter a budget greater than ₹0.')
  if (!Array.isArray(tripData.interests) || tripData.interests.length === 0) throw new Error('Select at least one interest to personalize your itinerary.')
  if (!Number.isInteger(Number(tripData.travellers)) || Number(tripData.travellers) < 1) throw new Error('Add at least one traveller.')
}

function scorePlace(place, tripData) {
  const requestedInterests = tripData.interests.map((interest) => interest.toLowerCase())
  const matchingInterests = place.interests.filter((interest) => requestedInterests.includes(interest.toLowerCase()))
  const interestMatchScore = Math.min(100, (matchingInterests.length / Math.max(1, requestedInterests.length)) * 100)
  const budget = Number(tripData.budget)
  const budgetScore = place.estimatedCost <= budget ? 100 : Math.max(0, 100 - ((place.estimatedCost - budget) / budget) * 100)
  const familyFriendlyScore = tripData.travelStyle === 'Family' ? (place.familyFriendly ? 100 : 30) : 70
  const travelStyleScore = tripData.travelStyle === 'Adventure'
    ? (place.interests.includes('Adventure') ? 100 : 45)
    : tripData.travelStyle === 'Relaxed'
      ? (place.estimatedVisitHours <= 4 ? 100 : 60)
      : tripData.travelStyle === 'Premium'
        ? Math.min(100, place.estimatedCost / Math.max(1, budget) * 100) : 75
  const durationScore = Math.max(0, 100 - Math.abs(place.estimatedVisitHours - 3.5) * 15)
  const overallScore = interestMatchScore * 0.4 + budgetScore * 0.2 + durationScore * 0.15 + familyFriendlyScore * 0.1 + travelStyleScore * 0.15

  return { place, interestMatchScore, budgetScore, familyFriendlyScore, travelStyleScore, durationScore, overallScore, matchingInterests }
}

function buildActivity(scoredPlace, startMinutes, tripData) {
  const { place, matchingInterests } = scoredPlace
  const durationMinutes = Math.min(180, Math.max(60, Math.round(place.estimatedVisitHours * 60)))
  const reason = matchingInterests.length
    ? `Strong match for ${matchingInterests.join(' and ')}.`
    : `A well-rated ${place.category.toLowerCase()} stop to round out your route.`
  return {
    placeId: place.id,
    placeName: place.name,
    startTime: formatTime(startMinutes),
    endTime: formatTime(startMinutes + durationMinutes),
    estimatedCost: place.estimatedCost,
    category: place.category,
    reason,
    durationHours: Number((durationMinutes / 60).toFixed(1)),
    location: `${place.city}, ${place.state}`,
    _endMinutes: startMinutes + durationMinutes,
  }
}

function createDailyPlans(selectedPlaces, days, tripData) {
  const dailyPlans = Array.from({ length: days }, (_, index) => ({ day: index + 1, activities: [] }))
  selectedPlaces.forEach((scoredPlace, index) => {
    const day = dailyPlans[index % days]
    const previousActivity = day.activities.at(-1)
    const startMinutes = previousActivity ? previousActivity._endMinutes + TRAVEL_GAP_MINUTES : ACTIVITY_START_MINUTES
    const activity = buildActivity(scoredPlace, startMinutes, tripData)
    if (startMinutes - ACTIVITY_START_MINUTES + (activity._endMinutes - startMinutes) <= DAY_ACTIVITY_MINUTES) day.activities.push(activity)
  })

  return dailyPlans.map((day) => {
    const activities = [...day.activities]
    if (activities.length > 0) {
      const lunchStart = activities[0]._endMinutes <= 13 * 60 ? 13 * 60 : activities[0]._endMinutes + 30
      activities.push({ placeId: `lunch-${day.day}`, placeName: 'Local food break', startTime: formatTime(lunchStart), endTime: formatTime(lunchStart + 60), estimatedCost: 0, category: 'Food', reason: `A flexible ${tripData.foodPreference?.toLowerCase() || 'local'} meal break near your route.`, durationHours: 1, location: day.activities[0].location, _endMinutes: lunchStart + 60, isBreak: true })
      activities.sort((first, second) => toMinutes(first.startTime) - toMinutes(second.startTime))
    }
    return { ...day, activities: activities.map(({ _endMinutes, ...activity }) => activity) }
  })
}

export function generateItinerary(tripData) {
  validateTripData(tripData)
  const days = Number(tripData.days)
  const budget = Number(tripData.budget)
  const destination = String(tripData.destination).trim().toLowerCase()
  const places = getPlacesByCity(destination).length
    ? getPlacesByCity(destination)
    : indianPlaces.filter((place) => [place.state, place.region, place.name].some((value) => value.toLowerCase().includes(destination)))
  if (!places.length) throw new Error(`We could not find attractions for ${tripData.destination} yet. Try another Indian destination.`)

  const scoredPlaces = places
    .map((place) => scorePlace(place, tripData))
    .sort((first, second) => second.overallScore - first.overallScore)
  const maxActivities = Math.max(days, days * 3)
  let runningCost = 0
  const selectedPlaces = []
  let removedForBudget = false

  for (const scoredPlace of scoredPlaces) {
    if (selectedPlaces.length >= maxActivities) break
    if (runningCost + scoredPlace.place.estimatedCost <= budget) {
      selectedPlaces.push(scoredPlace)
      runningCost += scoredPlace.place.estimatedCost
    } else {
      removedForBudget = true
    }
  }

  if (!selectedPlaces.length) {
    const lowestCost = scoredPlaces.sort((first, second) => first.place.estimatedCost - second.place.estimatedCost)[0]
    if (!lowestCost || lowestCost.place.estimatedCost > budget) {
      return { destination: tripData.destination, days, totalEstimatedCost: 0, remainingBudget: budget, warning: 'Your budget is too low for the available attractions in this destination.', dailyPlans: [], aiSummary: `We found places in ${tripData.destination}, but your current budget is too low to add an attraction.` }
    }
  }

  const dailyPlans = createDailyPlans(selectedPlaces, days, tripData)
  const activities = dailyPlans.flatMap((day) => day.activities).filter((activity) => !activity.isBreak)
  const totalEstimatedCost = activities.reduce((total, activity) => total + activity.estimatedCost, 0)
  const totalActivityHours = Number(activities.reduce((total, activity) => total + activity.durationHours, 0).toFixed(1))
  const interestLabel = tripData.interests.slice(0, 2).join(' and ')
  const warning = removedForBudget ? 'Some attractions were removed to keep your trip within budget.' : ''

  return {
    destination: tripData.destination,
    days,
    totalEstimatedCost,
    remainingBudget: budget - totalEstimatedCost,
    warning,
    totalActivityHours,
    numberOfPlaces: activities.length,
    estimatedTravelTime: 'Travel time will be estimated when Maps integration is connected.',
    dailyPlans,
    aiSummary: `Your itinerary prioritizes ${interestLabel} while staying within your ₹${budget.toLocaleString('en-IN')} budget.`,
  }
}
