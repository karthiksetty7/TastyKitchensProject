import {useContext, useEffect, useState} from 'react'
import {HiOutlineMinusSm} from 'react-icons/hi'
import {BsPlus} from 'react-icons/bs'
import {FaRupeeSign, FaHeart, FaRegHeart} from 'react-icons/fa'
import {CheckoutContext} from '../../context/CheckoutContext'

import {
  addFoodItemToFavorites,
  removeFoodItemFromFavorites,
  isFoodItemFavorite,
} from '../../utils/favoritesStorage'

import './index.css'

const FoodItems = props => {
  const {foodDetails, onUnfavoriteItem, isRestaurantOpen} = props
  const {id, name, imageUrl, cost, restaurantId, restaurantName} = foodDetails

  // 1. Access the global context
  const {checkoutData, setCheckoutData} = useContext(CheckoutContext)

  const [count, setCount] = useState(0)
  const [isSaved, setIsSaved] = useState(isFoodItemFavorite(id))

  // 2. Sync local count with context state
  useEffect(() => {
    const existingItem = checkoutData.cartItems?.find(item => item.id === id)
    setCount(existingItem ? existingItem.quantity : 0)
  }, [checkoutData.cartItems, id])

  // 3. Centralized update function
  const updateCart = newQuantity => {
    setCheckoutData(prev => {
      let updatedCart = [...(prev.cartItems || [])]
      const existingIndex = updatedCart.findIndex(item => item.id === id)

      if (newQuantity <= 0) {
        updatedCart = updatedCart.filter(item => item.id !== id)
      } else if (existingIndex !== -1) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: newQuantity,
        }
      } else {
        updatedCart.push({
          id,
          name,
          cost,
          quantity: newQuantity,
          imageUrl,
          restaurantId,
          restaurantName,
        })
      }
      return {...prev, cartItems: updatedCart}
    })
  }

  const onClickAdd = () => {
    if (!isRestaurantOpen) return

    // Guard: Check if items in cart are from a different restaurant
    if (
      checkoutData.cartItems.length > 0 &&
      String(checkoutData.cartItems[0].restaurantId) !== String(restaurantId)
    ) {
      if (
        window.confirm(
          'You have items from another restaurant in your cart. Do you want to clear your cart and start a new order from this restaurant?',
        )
      ) {
        setCheckoutData(prev => ({...prev, cartItems: []}))
        updateCart(1)
      }
    } else {
      updateCart(1)
    }
  }

  const onClickIncrement = () => {
    if (!isRestaurantOpen) return

    // Safety check for incrementing
    if (
      checkoutData.cartItems.length > 0 &&
      String(checkoutData.cartItems[0].restaurantId) !== String(restaurantId)
    ) {
      alert('You cannot add items from different restaurants.')
      return
    }
    updateCart(count + 1)
  }

  const onClickDecrement = () => {
    if (!isRestaurantOpen) return
    updateCart(count - 1)
  }

  const onToggleSaveItem = () => {
    if (isSaved) {
      removeFoodItemFromFavorites(id)
      setIsSaved(false)
      if (onUnfavoriteItem) onUnfavoriteItem()
    } else {
      addFoodItemToFavorites(foodDetails)
      setIsSaved(true)
    }
  }

  return (
    <li
      className={`food-item-card ${!isRestaurantOpen ? 'disabled' : ''}`}
      data-testid="foodItem"
    >
      <img src={imageUrl} alt={name} className="food-image" />
      <div className="food-details">
        <div className="food-item-header">
          <h1 className="food-name">{name}</h1>
          <button
            type="button"
            className="item-favorite-btn"
            onClick={onToggleSaveItem}
          >
            {isSaved ? (
              <FaHeart className="food-favorite-icon active" />
            ) : (
              <FaRegHeart className="food-favorite-icon" />
            )}
          </button>
        </div>
        <div className="food-price-container">
          <FaRupeeSign className="rupee-icon" />
          <p className="food-price">{cost}</p>
        </div>
        {count === 0 ? (
          <button
            type="button"
            className="add-button"
            onClick={onClickAdd}
            disabled={!isRestaurantOpen}
          >
            {isRestaurantOpen ? 'Add' : 'Closed'}
          </button>
        ) : (
          <div className="quantity-controller">
            <button
              type="button"
              data-testid="decrement-count"
              className="count-button"
              onClick={onClickDecrement}
            >
              <HiOutlineMinusSm />
            </button>
            <p data-testid="active-count" className="count-text">
              {count}
            </p>
            <button
              type="button"
              data-testid="increment-count"
              className="count-button"
              onClick={onClickIncrement}
            >
              <BsPlus />
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

export default FoodItems
