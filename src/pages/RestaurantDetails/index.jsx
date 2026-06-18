import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaStar, FaSearch} from 'react-icons/fa'
import {Oval} from 'react-loader-spinner'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import FoodItems from '../../components/FoodItems'
import SomethingWentWrong from '../../components/SomethingWentWrong'
import RestaurantReviews from '../../components/RestaurantReviews'
import {addRecentlyViewed} from '../../utils/recentlyViewedStorage'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const parseTime = timeString => {
  if (!timeString) return null

  // 1. Extract only the time part BEFORE the comma
  // This turns "10:00 AM, Tomorrow" into "10:00 AM"
  const timePart = timeString.split(',')[0].trim()

  // 2. Split into time and modifier
  const [time, modifier] = timePart.split(' ')
  let [hours, minutes] = time.split(':').map(Number)

  // 3. Convert to 24-hour format
  if (modifier && modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12
  if (modifier && modifier.toUpperCase() === 'AM' && hours === 12) hours = 0

  return hours * 60 + minutes
}

const RestaurantDetails = () => {
  const {id} = useParams()

  const [restaurantData, setRestaurantData] = useState(null)
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const [foodSearch, setFoodSearch] = useState('')
  const [foodFilter, setFoodFilter] = useState('ALL')
  const [foodSort, setFoodSort] = useState('DEFAULT')

  useEffect(() => {
    getRestaurantDetails()
  }, [id])

  const getRestaurantDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(
        `https://apis.ccbp.in/restaurants-list/${id}`,
        options,
      )

      if (response.ok) {
        const data = await response.json()

        const updatedData = {
          id: data.id,
          name: data.name,
          imageUrl: data.image_url,
          cuisine: data.cuisine,
          location: data.location,
          rating: data.rating,
          costForTwo: data.cost_for_two,
          reviewsCount: data.reviews_count,
          opensAt: data.opens_at,
          foodItems: data.food_items.map(eachItem => ({
            id: eachItem.id,
            name: eachItem.name,
            imageUrl: eachItem.image_url,
            cost: eachItem.cost,
            foodType: eachItem.food_type,
            rating: eachItem.rating,
            restaurantId: data.id,
            restaurantName: data.name,
          })),
        }

        setRestaurantData(updatedData)
        setApiStatus(apiStatusConstants.success)

        // Save to recently viewed list once details are loaded successfully
        addRecentlyViewed({
          id: updatedData.id,
          name: updatedData.name,
          imageUrl: updatedData.imageUrl,
          cuisine: updatedData.cuisine,
          userRating: {
            rating: updatedData.rating,
            totalReviews: updatedData.reviewsCount,
          },
        })
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const renderLoader = () => (
    <div
      className="restaurant-loader-container"
      data-testid="restaurant-details-loader"
    >
      <Oval color="gold" height={50} width={50} />
    </div>
  )

  const renderFailureView = () => (
    <SomethingWentWrong onRetry={getRestaurantDetails} />
  )

  const renderRestaurantDetails = () => {
    const {
      name,
      imageUrl,
      cuisine,
      location,
      rating,
      costForTwo,
      reviewsCount,
      opensAt,
      foodItems,
    } = restaurantData

    // 1. Calculate timing (Defaulting closing time to 12 hours after opening)
    const openMinutes = parseTime(opensAt)
    const closeMinutes = openMinutes + 720 // 720 minutes = 12 hours

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    // 2. Define closing window (9:00 PM to 12:00 AM)
    const isNightClosed = currentMinutes >= 1260 && currentMinutes < 1440

    // 3. Status logic: Open if NOT in night-closed window AND within operating range
    const isOpen =
      !isNightClosed &&
      currentMinutes >= openMinutes &&
      currentMinutes <= closeMinutes

    // 2. Filter Logic
    let filteredFoodItems = [...foodItems]

    if (foodSearch !== '') {
      filteredFoodItems = filteredFoodItems.filter(eachItem =>
        eachItem.name.toLowerCase().includes(foodSearch.toLowerCase()),
      )
    }

    if (foodFilter === 'VEG') {
      filteredFoodItems = filteredFoodItems.filter(
        eachItem => eachItem.foodType === 'VEG',
      )
    }

    if (foodFilter === 'NON-VEG') {
      filteredFoodItems = filteredFoodItems.filter(
        eachItem => eachItem.foodType === 'NON-VEG',
      )
    }

    // 3. Sort Logic
    switch (foodSort) {
      case 'NAME':
        filteredFoodItems.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'PRICE_LOW':
        filteredFoodItems.sort((a, b) => a.cost - b.cost)
        break
      case 'PRICE_HIGH':
        filteredFoodItems.sort((a, b) => b.cost - a.cost)
        break
      default:
        break
    }

    return (
      <>
        <div className="restaurant-banner">
          <div className="restaurant-banner-content">
            <img
              src={imageUrl}
              alt="restaurant"
              className="restaurant-banner-image"
            />

            <div className="restaurant-info">
              <h1 className="restaurant-title">{name}</h1>

              <p className="restaurant-cuisine">{cuisine}</p>

              <p className="restaurant-location">{location}</p>

              <p className="restaurant-timing">
                {isOpen ? 'Open Now' : `Currently Closed. Opens at ${opensAt}`}
              </p>

              <div className="restaurant-meta">
                <div>
                  <div className="rating-row">
                    <FaStar className="details-star-icon" />

                    <p className="rating-value">{rating}</p>
                  </div>

                  <p className="meta-text">{reviewsCount}+ Ratings</p>
                </div>

                <div className="separator" />

                <div>
                  <p className="rating-value">₹ {costForTwo}</p>

                  <p className="meta-text">Cost for two</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="food-controls">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search food item"
              className="food-search-input"
              value={foodSearch}
              onChange={e => setFoodSearch(e.target.value)}
            />
          </div>

          <div className="food-filter-buttons">
            <button
              type="button"
              className={foodFilter === 'ALL' ? 'active-filter' : ''}
              onClick={() => setFoodFilter('ALL')}
            >
              All
            </button>

            <button
              type="button"
              className={foodFilter === 'VEG' ? 'active-filter' : ''}
              onClick={() => setFoodFilter('VEG')}
            >
              Veg
            </button>

            <button
              type="button"
              className={foodFilter === 'NON-VEG' ? 'active-filter' : ''}
              onClick={() => setFoodFilter('NON-VEG')}
            >
              Non Veg
            </button>
          </div>

          <select
            className="food-sort-select"
            value={foodSort}
            onChange={e => setFoodSort(e.target.value)}
          >
            <option value="DEFAULT">Sort Foods</option>
            <option value="NAME">Name A-Z</option>
            <option value="PRICE_LOW">Price Low-High</option>
            <option value="PRICE_HIGH">Price High-Low</option>
          </select>
        </div>

        <div className="food-section">
          {filteredFoodItems.length === 0 ? (
            <div className="no-foods-container">
              <img
                src="https://res.cloudinary.com/dlvle38po/image/upload/v1780918942/cooking_1_y1xy8a.png"
                alt="no food items found"
                className="no-foods-image"
              />
              <h1>No Food Items Found</h1>
              <p>Try changing search text or filters.</p>
            </div>
          ) : (
            <ul className="food-items-list">
              {filteredFoodItems.map(eachItem => (
                <FoodItems
                  key={eachItem.id}
                  foodDetails={eachItem}
                  isRestaurantOpen={isOpen}
                />
              ))}
            </ul>
          )}
        </div>
        <RestaurantReviews restaurantId={id} />
      </>
    )
  }

  const renderContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoader()

      case apiStatusConstants.success:
        return renderRestaurantDetails()

      case apiStatusConstants.failure:
        return renderFailureView()

      default:
        return null
    }
  }

  return (
    <>
      <Header />
      {renderContent()}
      <Footer />
    </>
  )
}

export default RestaurantDetails
