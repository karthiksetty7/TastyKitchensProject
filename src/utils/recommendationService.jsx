import {getFavorites} from './favoritesStorage'
import {getRecentlyViewed} from './recentlyViewedStorage'
import {getOrderHistory} from './orderHistoryStorage'

export const getRecommendedRestaurants = allRestaurants => {
  const favorites = getFavorites()
  const recentlyViewed = getRecentlyViewed()
  const orders = getOrderHistory()

  const cuisineScores = {}
  const WEIGHTS = {order: 3, favorite: 2, viewed: 1}

  const updateScore = (cuisine, weight) => {
    cuisineScores[cuisine] = (cuisineScores[cuisine] || 0) + weight
  }

  orders.forEach(
    o => o.items?.forEach(i => updateScore(i.cuisine, WEIGHTS.order)),
  )
  favorites.forEach(f => updateScore(f.cuisine, WEIGHTS.favorite))
  recentlyViewed.forEach(rv => updateScore(rv.cuisine, WEIGHTS.viewed))

  return allRestaurants
    .map(r => ({...r, score: cuisineScores[r.cuisine] || 0}))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 recommendations
}
