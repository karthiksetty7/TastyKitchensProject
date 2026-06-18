import {getOrderHistory} from './orderHistoryStorage'
import {getFavorites, getFavoriteItems} from './favoritesStorage'

export const getAchievements = () => {
  const orders = getOrderHistory() || []
  const favorites = getFavorites() || []
  const favoriteItems = getFavoriteItems() || []

  const achievements = []

  // Threshold-based achievements
  if (orders.length >= 1) achievements.push('🥉 First Order Placed')
  if (orders.length >= 10) achievements.push('🥈 Regular Customer')
  if (orders.length >= 25) achievements.push('🥇 Food Explorer')

  // Engagement-based achievements
  const totalFavorites = favorites.length + favoriteItems.length
  if (totalFavorites >= 5) achievements.push('❤️ Curator')
  if (totalFavorites >= 10) achievements.push('⭐ Super Fan')

  return achievements
}
