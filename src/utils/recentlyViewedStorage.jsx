const RECENTLY_VIEWED_KEY = 'recently_viewed_restaurants'

export const getRecentlyViewed = () => {
  const restaurants = localStorage.getItem(RECENTLY_VIEWED_KEY)
  return restaurants ? JSON.parse(restaurants) : []
}

export const addRecentlyViewed = restaurant => {
  let restaurants = getRecentlyViewed()

  // 1. Remove the restaurant if it already exists (prevents duplicates)
  restaurants = restaurants.filter(item => item.id !== restaurant.id)

  // 2. Insert the newly clicked restaurant at the absolute beginning (index 0)
  restaurants.unshift(restaurant)

  // 3. Keep only the top 10 latest items
  restaurants = restaurants.slice(0, 10)

  // 4. Save back to localStorage
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(restaurants))
}
