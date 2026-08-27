export function receiveTripRequest(tripData) {
  const {
    destination,
    days,
    budget,
    interests,
    travellers,
    travelStyle,
    transportation,
    foodPreference,
    travelDate,
  } = tripData

  return {
    destination,
    days,
    budget,
    interests,
    travellers,
    travelStyle,
    transportation,
    foodPreference,
    travelDate,
  }
}
