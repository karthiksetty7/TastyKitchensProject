import './index.css'

const SomethingWentWrong = props => {
  const {onRetry} = props

  return (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />

      <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>

      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>

      <button type="button" className="retry-button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default SomethingWentWrong
