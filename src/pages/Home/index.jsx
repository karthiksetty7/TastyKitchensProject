import {useEffect, useState, useMemo} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import {Oval} from 'react-loader-spinner'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import RestaurantsHeader from '../../components/RestaurantsHeader'
import AllRestaurants from '../../components/AllRestaurants'
import SomethingWentWrong from '../../components/SomethingWentWrong'
import NoRestaurantsFound from '../../components/NoRestaurantsFound'
import RecentlyViewed from '../../components/RecentlyViewed'

import {getRecommendedRestaurants} from '../../utils/recommendationService'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const sortByOptions = {
  lowest: 'Lowest',
  highest: 'Highest',
}

const limit = 9

const Home = () => {
  const [offersList, setOffersList] = useState([])
  const [masterRestaurantsList, setMasterRestaurantsList] = useState([])

  const [offersStatus, setOffersStatus] = useState(apiStatusConstants.initial)
  const [restaurantsStatus, setRestaurantsStatus] = useState(
    apiStatusConstants.initial,
  )

  const [activePage, setActivePage] = useState(1)
  const [sortBy, setSortBy] = useState(sortByOptions.highest)
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    getOffersData()
    getRestaurantsData()
  }, [])

  // Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim().length > 0) {
        const filtered = masterRestaurantsList.filter(each =>
          each.name.toLowerCase().includes(searchInput.toLowerCase()),
        )
        setSuggestions(filtered.slice(0, 5))
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, masterRestaurantsList])

  // RATING CATEGORY
  const getRatingCategory = rating => {
    if (rating >= 4.0) return {label: 'Highly Rated', color: '#2ecc71'}
    if (rating >= 3.7) return {label: 'Good', color: '#f1c40f'}
    return {label: 'Average', color: '#e67e22'}
  }

  // RECOMMENDATION LIST
  const recommendedList = useMemo(() => {
    // Only show if we have data and no active search
    if (searchInput === '' && masterRestaurantsList.length > 0) {
      return getRecommendedRestaurants(masterRestaurantsList)
    }
    return []
  }, [masterRestaurantsList, searchInput])

  // GLOBAL SORTING & PAGINATION LOGIC
  const paginatedList = useMemo(() => {
    let processedList = [...masterRestaurantsList]

    // Apply Search Filter
    if (searchInput !== '') {
      processedList = processedList.filter(each =>
        each.name.toLowerCase().includes(searchInput.toLowerCase()),
      )
    }

    // Apply Global Sort
    processedList.sort((a, b) => {
      // 1. Primary Sort: Rating
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      // 2. Tie-breaker: Number of reviews
      return b.totalReviews - a.totalReviews
    })

    // Apply Pagination
    const startIndex = (activePage - 1) * limit
    return processedList.slice(startIndex, startIndex + limit)
  }, [masterRestaurantsList, sortBy, activePage, searchInput])

  const onSelectSuggestion = name => {
    setSearchInput(name)
    setSuggestions([])
  }

  const getOffersData = async () => {
    setOffersStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}

    try {
      const response = await fetch(
        'https://apis.ccbp.in/restaurants-list/offers',
        options,
      )
      if (response.ok) {
        const data = await response.json()
        setOffersList(data.offers.map(o => ({id: o.id, imageUrl: o.image_url})))
        setOffersStatus(apiStatusConstants.success)
      } else {
        setOffersStatus(apiStatusConstants.failure)
      }
    } catch {
      setOffersStatus(apiStatusConstants.failure)
    }
  }

  const getRestaurantsData = async () => {
    setRestaurantsStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    // Fetch a larger limit to ensure we have a good pool to sort locally
    const apiUrl = `https://apis.ccbp.in/restaurants-list?limit=50`
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.restaurants.map(each => ({
          id: each.id,
          name: each.name,
          imageUrl: each.image_url,
          cuisine: each.cuisine,
          rating: parseFloat(each.user_rating.rating),
          totalReviews: each.user_rating.total_reviews,
        }))
        setMasterRestaurantsList(updatedData)
        setRestaurantsStatus(apiStatusConstants.success)
      } else {
        setRestaurantsStatus(apiStatusConstants.failure)
      }
    } catch {
      setRestaurantsStatus(apiStatusConstants.failure)
    }
  }

  const onClickNextPage = () => activePage < 4 && setActivePage(p => p + 1)
  const onClickPreviousPage = () => activePage > 1 && setActivePage(p => p - 1)

  const changeSortBy = value => {
    setSortBy(value)
    setActivePage(1)
  }

  const onChangeSearchInput = value => {
    setSearchInput(value)
    setActivePage(1)
  }

  const renderOffers = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
    }
    return (
      <div className="carousel-wrapper-container">
        <Slider {...settings}>
          {offersList.map(eachOffer => (
            <div key={eachOffer.id} className="carousel-slide-item">
              <img
                src={eachOffer.imageUrl}
                alt="offer"
                className="offer-image"
              />
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  const renderOffersLoader = () => (
    <div data-testid="restaurants-offers-loader" className="loader-container">
      <Oval color="gold" height={50} width={50} />
    </div>
  )

  const renderRestaurantsLoader = () => (
    <div data-testid="restaurants-list-loader" className="loader-container">
      <Oval color="gold" height={50} width={50} />
    </div>
  )

  const renderOffersFailureView = () => (
    <SomethingWentWrong onRetry={getOffersData} />
  )
  const renderRestaurantsFailureView = () => <NoRestaurantsFound />

  return (
    <>
      <Header />
      <div className="home-container">
        {offersStatus === apiStatusConstants.inProgress && renderOffersLoader()}
        {offersStatus === apiStatusConstants.failure &&
          renderOffersFailureView()}
        {offersStatus === apiStatusConstants.success && renderOffers()}

        <RecentlyViewed />

        {recommendedList.length > 0 && (
          <>
            <h1 className="recommendations-heading">Recommended For You</h1>
            <ul className="restaurants-list">
              {recommendedList.map(each => (
                <AllRestaurants
                  key={each.id}
                  restaurantDetails={each}
                  getRatingCategory={getRatingCategory}
                />
              ))}
            </ul>
          </>
        )}

        <RestaurantsHeader
          activeOptionId={sortBy}
          onChangeSortBy={changeSortBy}
          suggestions={suggestions}
          onSelectSuggestion={onSelectSuggestion}
          searchInput={searchInput}
          onChangeSearchInput={onChangeSearchInput}
        />

        {restaurantsStatus === apiStatusConstants.inProgress &&
          renderRestaurantsLoader()}
        {restaurantsStatus === apiStatusConstants.failure &&
          renderRestaurantsFailureView()}

        {restaurantsStatus === apiStatusConstants.success && (
          <>
            <ul className="restaurants-list">
              {paginatedList.map(eachRestaurant => (
                <AllRestaurants
                  key={eachRestaurant.id}
                  restaurantDetails={eachRestaurant}
                  getRatingCategory={getRatingCategory}
                />
              ))}
            </ul>

            <div className="pagination-container">
              <button
                type="button"
                data-testid="pagination-left-button"
                onClick={onClickPreviousPage}
              >
                {'<'}
              </button>
              <p>
                <span data-testid="active-page-number">{activePage}</span> of 4
              </p>
              <button
                type="button"
                data-testid="pagination-right-button"
                onClick={onClickNextPage}
              >
                {'>'}
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Home
