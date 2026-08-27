const expenses = new Map()

export function addExpense(tripId, expense) {
  const tripExpenses = expenses.get(tripId) || []
  const savedExpense = { id: `${tripId}-${Date.now()}`, ...expense }
  expenses.set(tripId, [...tripExpenses, savedExpense])
  return savedExpense
}

export function getExpenses(tripId) {
  return expenses.get(tripId) || []
}
