import {useState} from 'react'
import {Link} from 'react-router-dom'
import {FaStar, FaHeart, FaRegHeart} from 'react-icons/fa'
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from '../../utils/favoritesStorage'

import './index.css'

const AllRestaurants = props => {
  // Added getRatingCategory to destructuring
  const {restaurantDetails, onUnfavorite, getRatingCategory} = props

  // Normalize data to handle both flat structure and nested userRating structure
  const {id, imageUrl, name, cuisine} = restaurantDetails

  const rating = restaurantDetails.userRating
    ? restaurantDetails.userRating.rating
    : restaurantDetails.rating

  const totalReviews = restaurantDetails.userRating
    ? restaurantDetails.userRating.totalReviews
    : restaurantDetails.totalReviews

  // Get category details for the badge
  const category = getRatingCategory ? getRatingCategory(rating) : null

  const [favorite, setFavorite] = useState(isFavorite(id))

  const onToggleFavorite = event => {
    event.preventDefault()
    event.stopPropagation()

    if (favorite) {
      removeFromFavorites(id)
      setFavorite(false)
      if (onUnfavorite) onUnfavorite()
    } else {
      addToFavorites(restaurantDetails)
      setFavorite(true)
    }
  }

  return (
    <li className="restaurant-card" data-testid="restaurant-item">
      <Link to={`/restaurant/${id}`} className="restaurant-link">
        <img src={imageUrl} alt="restaurant" className="restaurant-image" />

        <div className="restaurant-content">
          <div className="restaurant-header">
            <h1 className="restaurant-name">{name}</h1>
            <button
              type="button"
              className="favorite-btn"
              onClick={onToggleFavorite}
            >
              {favorite ? (
                <FaHeart className="favorite-icon active" />
              ) : (
                <FaRegHeart className="favorite-icon" />
              )}
            </button>
          </div>

          <p className="restaurant-cuisine">{cuisine}</p>

          <div className="rating-container">
            <FaStar className="star-icon" />
            <p className="rating-text">{rating}</p>

            {category && (
              <span
                className={`rating-tag ${
                  category.label === 'Highly Rated'
                    ? 'tag-highly-rated'
                    : category.label === 'Good'
                    ? 'tag-good'
                    : 'tag-average'
                }`}
              >
                {category.label}
              </span>
            )}

            {totalReviews && (
              <p className="reviews-text">({totalReviews} ratings)</p>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}

export default AllRestaurants
