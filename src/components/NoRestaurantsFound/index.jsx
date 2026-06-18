import './index.css'

const NoRestaurantsFound = () => (
  <div className="failure-view-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      alt="no restaurants"
      className="failure-image"
    />

    <h1 className="failure-heading-text">No Restaurants Found</h1>

    <p className="failure-description">
      Try searching with another restaurant name.
    </p>
  </div>
)

export default NoRestaurantsFound
