import {useState, useEffect, useMemo} from 'react'
import {getReviews, addReview} from '../../utils/reviewStorage'
import './index.css'

const RestaurantReviews = ({restaurantId}) => {
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)

  useEffect(() => {
    setReviews(getReviews(restaurantId))
  }, [restaurantId])

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }, [reviews])

  const handleSubmit = () => {
    if (!reviewText.trim()) return
    const newReview = {
      id: Date.now(),
      restaurantId,
      rating,
      comment: reviewText,
      createdAt: new Date().toISOString(),
    }
    addReview(newReview)
    setReviews(getReviews(restaurantId))
    setReviewText('')
    setRating(5)
  }

  return (
    <div className="reviews-section">
      <h2 className="reviews-header">Customer Reviews</h2>
      <p className="avg-rating">
        Average Rating: <strong>{averageRating}</strong> ⭐ ({reviews.length}{' '}
        reviews)
      </p>

      <div className="review-form">
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>
              {n} Stars
            </option>
          ))}
        </select>
        <textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder="What did you think of the food?"
        />
        <button onClick={handleSubmit}>Submit Review</button>
      </div>

      <ul className="reviews-list">
        {reviews.map(each => (
          <li key={each.id} className="review-card">
            <div className="review-rating">⭐ {each.rating} Stars</div>
            <p className="review-comment">{each.comment}</p>
            <p className="review-date">
              {new Date(each.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default RestaurantReviews
