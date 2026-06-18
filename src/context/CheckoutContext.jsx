import {createContext, useState, useEffect} from 'react'

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
      cartItems: oldCart ? JSON.parse(oldCart) : [],
      subtotal: 0,
      gst: 0,
      deliveryFee: 0,
      discount: 0,
      grandTotal: 0,
    }
  })

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData))
  }, [checkoutData])

  // Clear state after a successful order
  const resetCheckout = () => {
    setCheckoutData({
      address: null,
      paymentMethod: null,
      coupon: null,
      cartItems: [],
      subtotal: 0,
      gst: 0,
      deliveryFee: 0,
      discount: 0,
      grandTotal: 0,
    })
    localStorage.removeItem('checkoutData')
  }

  return (
    <CheckoutContext.Provider
      value={{checkoutData, setCheckoutData, resetCheckout}}
    >
      {children}
    </CheckoutContext.Provider>
  )
}
