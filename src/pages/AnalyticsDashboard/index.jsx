import {useMemo} from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import {
  getDashboardAnalytics,
  getMostOrderedRestaurant,
  getMostOrderedFood,
} from '../../utils/analyticsService'

import {getOrderHistory} from '../../utils/orderHistoryStorage'
import {getAchievements} from '../../utils/achievementService'

import './index.css'

const AnalyticsDashboard = () => {
  const dashboardData = useMemo(() => {
    const orders = getOrderHistory() || []

    const analytics = getDashboardAnalytics()

    const topRestaurant = getMostOrderedRestaurant(orders)

    const topFood = getMostOrderedFood(orders)

    const achievements = getAchievements()

    // -------------------------
    // Monthly Spending Chart
    // -------------------------

    const monthlyMap = {}

    orders.forEach(order => {
      const date = new Date(order.savedAt)

      const month = date.toLocaleString('default', {
        month: 'short',
      })

      monthlyMap[month] =
        (monthlyMap[month] || 0) + Number(order.finalAmount || 0)
    })

    const chartData = Object.keys(monthlyMap).map(month => ({
      name: month,
      spent: monthlyMap[month],
    }))

    // -------------------------
    // Total Savings
    // -------------------------

    const totalSavings = orders.reduce(
      (sum, order) =>
        sum + Number(order.discount || 0) + Number(order.deliveryDiscount || 0),
      0,
    )

    // -------------------------
    // Food Journey Score
    // -------------------------

    const foodJourneyScore =
      analytics.totalOrders * 10 +
      analytics.favoriteRestaurants * 5 +
      analytics.favoriteFoods * 3 +
      analytics.rewardPoints

    // -------------------------
    // Reward Tier
    // -------------------------

    let rewardTier = 'Bronze 🥉'

    if (analytics.rewardPoints >= 2000) {
      rewardTier = 'Platinum 💎'
    } else if (analytics.rewardPoints >= 1000) {
      rewardTier = 'Gold 🥇'
    } else if (analytics.rewardPoints >= 500) {
      rewardTier = 'Silver 🥈'
    }

    // -------------------------
    // Customer Since
    // -------------------------

    let customerSince = 'N/A'

    if (orders.length > 0) {
      customerSince = new Date(
        orders[orders.length - 1].savedAt,
      ).toLocaleDateString()
    }

    return {
      analytics,
      topRestaurant,
      topFood,
      achievements,
      chartData,
      totalSavings,
      foodJourneyScore,
      rewardTier,
      customerSince,
    }
  }, [])

  const {
    analytics,
    topRestaurant,
    topFood,
    achievements,
    chartData,
    totalSavings,
    foodJourneyScore,
    rewardTier,
    customerSince,
  } = dashboardData

  return (
    <>
      <Header />

      <div className="analytics-page">
        <h1 className="analytics-main-heading">Foodie Insights 🍔</h1>

        {/* KPI Cards */}

        <div className="analytics-grid">
          <div className="analytics-card">
            <span className="card-icon">📦</span>

            <h3>Total Orders</h3>

            <p className="card-value">{analytics.totalOrders}</p>
          </div>

          <div className="analytics-card">
            <span className="card-icon">💰</span>

            <h3>Total Revenue</h3>

            <p className="card-value">₹{analytics.totalRevenue}</p>
          </div>

          <div className="analytics-card">
            <span className="card-icon">📈</span>

            <h3>Average Order</h3>

            <p className="card-value">₹{analytics.averageOrderValue}</p>
          </div>

          <div className="analytics-card">
            <span className="card-icon">💎</span>

            <h3>Reward Points</h3>

            <p className="card-value">{analytics.rewardPoints}</p>
          </div>
        </div>

        {/* Customer Summary */}

        <div className="analytics-card customer-summary-card">
          <h2>Customer Summary 👤</h2>

          <p>
            <strong>Customer Since:</strong> {customerSince}
          </p>

          <p>
            <strong>Reward Tier:</strong> {rewardTier}
          </p>

          <p>
            <strong>Food Journey Score:</strong> {foodJourneyScore}
          </p>
        </div>

        {/* Spending Chart */}

        <div className="analytics-card chart-section">
          <h2>Monthly Spending Trend 📈</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="spent"
                stroke="#f7931e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}

        <div className="analytics-insight-grid">
          <div className="analytics-card highlight-card">
            <h3>🏆 Top Restaurant</h3>

            <p>{topRestaurant[0]}</p>

            <span className="sub-text">{topRestaurant[1]} Orders</span>
          </div>

          <div className="analytics-card highlight-card">
            <h3>🍔 Most Ordered Food</h3>

            <p>{topFood[0]}</p>

            <span className="sub-text">{topFood[1]} Portions</span>
          </div>

          <div className="analytics-card highlight-card">
            <h3>❤️ Favorite Restaurants</h3>

            <p>{analytics.favoriteRestaurants}</p>

            <span className="sub-text">Saved Restaurants</span>
          </div>

          <div className="analytics-card highlight-card">
            <h3>🍔 Favorite Foods</h3>

            <p>{analytics.favoriteFoods}</p>

            <span className="sub-text">Saved Food Items</span>
          </div>

          <div className="analytics-card highlight-card">
            <h3>⭐ Average Rating</h3>

            <p>{analytics.averageRating}</p>

            <span className="sub-text">User Reviews</span>
          </div>

          <div className="analytics-card highlight-card">
            <h3>💸 Money Saved</h3>

            <p>₹{totalSavings}</p>

            <span className="sub-text">Coupons & Discounts</span>
          </div>
        </div>

        {/* Achievements */}

        <div className="achievement-section">
          <h2>Achievements 🏆</h2>

          <div className="achievements-list">
            {achievements.length > 0 ? (
              achievements.map((badge, index) => (
                <div key={index} className="achievement-card">
                  {badge}
                </div>
              ))
            ) : (
              <p>Place more orders to unlock achievements.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default AnalyticsDashboard
