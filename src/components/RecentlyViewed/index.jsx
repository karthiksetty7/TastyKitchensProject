import {getRecentlyViewed} from '../../utils/recentlyViewedStorage'
import AllRestaurants from '../AllRestaurants'

import './index.css'

const RecentlyViewed = () => {
  const restaurants = getRecentlyViewed()

  const getRatingCategory = rating => {
    if (rating >= 4.0) return {label: 'Highly Rated'}
    if (rating >= 3.7) return {label: 'Good'}
    return {label: 'Average'}
  }

  if (restaurants.length === 0) {
    return null
  }

  return (
    <div className="recently-viewed-container">
      <h1 className="recently-viewed-heading">Recently Viewed 👀</h1>

      <ul className="recently-viewed-list">
        {restaurants.map(eachRestaurant => (
          <AllRestaurants
            key={`recent-${eachRestaurant.id}`}
            restaurantDetails={eachRestaurant}
            getRatingCategory={getRatingCategory}
          />
        ))}
      </ul>

      <hr className="recently-viewed-divider" />
    </div>
  )
}

export default RecentlyViewed
