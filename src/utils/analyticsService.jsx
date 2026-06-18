import {getOrderHistory} from './orderHistoryStorage'
import {getFavorites, getFavoriteItems} from './favoritesStorage'
import {getWishlist} from './wishlistStorage'
import {getRewardPoints} from './rewardService'
import {getAllReviews} from './reviewStorage'

export const getDashboardAnalytics = () => {
  const orders = getOrderHistory() || []
  const favorites = getFavorites() || []
  const favoriteItems = getFavoriteItems() || []
  const wishlist = getWishlist() || []
  const rewardPoints = getRewardPoints() || 0
  const reviews = getAllReviews() || []

  const totalRevenue = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0)

  return {
    totalOrders: orders.length,

    totalRevenue: totalRevenue.toFixed(2),

    averageOrderValue:
      orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0,

    favoriteRestaurants: favorites.length,

    favoriteFoods: favoriteItems.length,

    totalFavorites: favorites.length + favoriteItems.length,

    totalWishlistItems: wishlist.length,

    rewardPoints,

    averageRating:
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0,
  }
}

export const getMostOrderedRestaurant = orders => {
  const map = {}
  orders.forEach(o => {
    map[o.restaurantName] = (map[o.restaurantName] || 0) + 1
  })
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
  return sorted[0] || ['None', 0]
}

export const getMostOrderedFood = orders => {
  const map = {}
  orders.forEach(o => {
    o.items?.forEach(i => {
      map[i.name] = (map[i.name] || 0) + i.quantity
    })
  })
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
  return sorted[0] || ['None', 0]
}
