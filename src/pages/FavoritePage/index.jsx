import {useState, useEffect} from 'react'
import Header from '../../components/Header'
import AllRestaurants from '../../components/AllRestaurants'
import FoodItems from '../../components/FoodItems'
import {getFavorites, getFavoriteItems} from '../../utils/favoritesStorage'
import './index.css'

const FavoritesPage = () => {
  const [activeTab, setActiveTab] = useState('RESTAURANTS')
  const [favoritesList, setFavoritesList] = useState([])
  const [favoriteItemsList, setFavoriteItemsList] = useState([])

  useEffect(() => {
    setFavoritesList(getFavorites())
    setFavoriteItemsList(getFavoriteItems())
  }, [])

  const handleUnfavoriteRefresh = () => {
    setFavoritesList(getFavorites())
  }

  const handleUnfavoriteItemRefresh = () => {
    setFavoriteItemsList(getFavoriteItems())
  }

  return (
    <>
      <Header />
      <div className="favorites-page-bg-container">
        {/* Toggle navigation bar tabs */}
        <div className="favorites-tabs-container">
          <button
            type="button"
            className={`tab-btn ${
              activeTab === 'RESTAURANTS' ? 'active-tab' : ''
            }`}
            onClick={() => setActiveTab('RESTAURANTS')}
          >
            Favorite Restaurants
          </button>
          <button
            type="button"
            className={`tab-btn ${
              activeTab === 'FOOD_ITEMS' ? 'active-tab' : ''
            }`}
            onClick={() => setActiveTab('FOOD_ITEMS')}
          >
            Liked Dishes
          </button>
        </div>

        {/* Dynamic Context Renderer */}
        {activeTab === 'RESTAURANTS' ? (
          favoritesList.length === 0 ? (
            <div className="no-favorites-view-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
                alt="no favorites"
                className="no-favorites-img"
              />
              <h1 className="no-favorites-heading">No Favorite Restaurants</h1>
              <p className="no-favorites-description">
                Move to Home page to add your favorite restaurants.
              </p>
            </div>
          ) : (
            <div className="favorites-content-wrapper">
              <h1 className="favorites-main-heading">
                My Favorite Restaurants
              </h1>
              <ul className="favorites-list-container">
                {favoritesList.map(eachRestaurant => (
                  <AllRestaurants
                    key={eachRestaurant.id}
                    restaurantDetails={eachRestaurant}
                    onUnfavorite={handleUnfavoriteRefresh}
                  />
                ))}
              </ul>
            </div>
          )
        ) : favoriteItemsList.length === 0 ? (
          <div className="no-favorites-view-container">
            <img
              src="https://res.cloudinary.com/dlvle38po/image/upload/v1780918942/cooking_1_y1xy8a.png"
              alt="no favorite food items"
              className="no-favorites-img"
            />
            <h1 className="no-favorites-heading">No Liked Dishes Yet</h1>
            <p className="no-favorites-description">
              Bookmark items on restaurant menu pages to easily remember them
              here!
            </p>
          </div>
        ) : (
          <div className="favorites-content-wrapper">
            <h1 className="favorites-main-heading">My Liked Dishes</h1>
            <ul className="favorites-food-list-container">
              {favoriteItemsList.map(eachItem => (
                <FoodItems
                  key={eachItem.id}
                  foodDetails={eachItem}
                  onUnfavoriteItem={handleUnfavoriteItemRefresh}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default FavoritesPage
