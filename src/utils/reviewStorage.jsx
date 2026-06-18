const REVIEW_KEY = 'restaurant_reviews'

export const getReviews = restaurantId => {
  const reviews = JSON.parse(localStorage.getItem(REVIEW_KEY)) || []

  return reviews.filter(
    each => String(each.restaurantId) === String(restaurantId),
  )
}

export const addReview = review => {
  const reviews = JSON.parse(localStorage.getItem(REVIEW_KEY)) || []

  reviews.unshift(review)

  localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews))
}

export const deleteReview = reviewId => {
  const reviews = JSON.parse(localStorage.getItem(REVIEW_KEY)) || []

  const updated = reviews.filter(each => each.id !== reviewId)

  localStorage.setItem(REVIEW_KEY, JSON.stringify(updated))
}

export const updateReview = updatedReview => {
  const reviews = JSON.parse(localStorage.getItem(REVIEW_KEY)) || []

  const updatedReviews = reviews.map(each =>
    each.id === updatedReview.id ? updatedReview : each,
  )

  localStorage.setItem(REVIEW_KEY, JSON.stringify(updatedReviews))
}

export const getAllReviews = () => {
  return JSON.parse(localStorage.getItem(REVIEW_KEY)) || []
}
