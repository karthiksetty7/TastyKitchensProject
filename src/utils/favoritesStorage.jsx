// Existing Restaurant Favorites Logic
const FAVORITES_KEY = 'favorite_restaurants'

export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY)
  return favorites ? JSON.parse(favorites) : []
}

export const addToFavorites = restaurant => {
  const favorites = getFavorites()
  const alreadyExists = favorites.some(item => item.id === restaurant.id)

  if (!alreadyExists) {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify([...favorites, restaurant]),
    )
  }
}

export const removeFromFavorites = restaurantId => {
  const favorites = getFavorites()
  const updatedFavorites = favorites.filter(item => item.id !== restaurantId)

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
}

export const isFavorite = restaurantId => {
  const favorites = getFavorites()
  return favorites.some(item => item.id === restaurantId)
}

// --- NEW: Food/Menu Items Favorites Logic ---
const FAVORITE_ITEMS_KEY = 'favorite_food_items'

export const getFavoriteItems = () => {
  const favoriteItems = localStorage.getItem(FAVORITE_ITEMS_KEY)
  return favoriteItems ? JSON.parse(favoriteItems) : []
}

export const addFoodItemToFavorites = foodItem => {
  const favoriteItems = getFavoriteItems()
  const alreadyExists = favoriteItems.some(item => item.id === foodItem.id)

  if (!alreadyExists) {
    localStorage.setItem(
      FAVORITE_ITEMS_KEY,
      JSON.stringify([...favoriteItems, foodItem]),
    )
  }
}

export const removeFoodItemFromFavorites = foodItemId => {
  const favoriteItems = getFavoriteItems()
  const updatedItems = favoriteItems.filter(item => item.id !== foodItemId)

  localStorage.setItem(FAVORITE_ITEMS_KEY, JSON.stringify(updatedItems))
}

export const isFoodItemFavorite = foodItemId => {
  const favoriteItems = getFavoriteItems()
  return favoriteItems.some(item => item.id === foodItemId)
}
