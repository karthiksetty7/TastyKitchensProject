import {createContext, useState, useEffect} from 'react'
import {getRewardPoints} from '../utils/rewardService'

export const CheckoutContext = createContext()

export const CheckoutProvider = ({children}) => {
  const [checkoutData, setCheckoutData] = useState(() => {
    const saved = localStorage.getItem('checkoutData')
    if (saved) return JSON.parse(saved)

    const oldCart = localStorage.getItem('cartData')
    return {
      address: null,
      paymentMethod: null,
      coupon: null,
      rewardDiscount: 0, // Added to track active redemption in checkout
      cartItems: oldCart ? JSON.parse(oldCart) : [],
      subtotal: 0,
      gst: 0,
      deliveryFee: 0,
      discount: 0,
      grandTotal: 0,
    }
  })

  // Global state for points to keep Header/UI in sync
  const [rewardPoints, setRewardPoints] = useState(getRewardPoints())

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData))
  }, [checkoutData])

  // Helper to refresh points in the UI after earning or redeeming
  const refreshPoints = () => {
    setRewardPoints(getRewardPoints())
  }

  // Clear state after a successful order
  const resetCheckout = () => {
    setCheckoutData({
      address: null,
      paymentMethod: null,
      coupon: null,
      rewardDiscount: 0,
      cartItems: [],
      subtotal: 0,
      gst: 0,
      deliveryFee: 0,
      discount: 0,
      grandTotal: 0,
    })
    localStorage.removeItem('checkoutData')
    refreshPoints() // Ensure UI updates
  }

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        setCheckoutData,
        resetCheckout,
        rewardPoints,
        refreshPoints,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}
