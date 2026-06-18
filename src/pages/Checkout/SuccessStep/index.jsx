import {useEffect, useState, useContext, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {FaCheckCircle} from 'react-icons/fa'
import CheckoutProgress from '../CheckoutProgress'
import {CheckoutContext} from '../../../context/CheckoutContext'
import {saveOrder} from '../../../utils/orderHistoryStorage'

import './index.css' // Add this at the top of your imports

const SuccessStep = () => {
  const navigate = useNavigate()
  const {checkoutData, resetCheckout} = useContext(CheckoutContext) // 2. Access checkoutData
  const [orderId, setOrderId] = useState('')
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (!hasProcessed.current) {
      const generatedId = `ORD-${Date.now().toString().slice(-6)}`
      setOrderId(generatedId)

      // 1. Capture the data while it still exists in context!
      const orderPayload = {
        restaurantName:
          checkoutData.cartItems[0]?.restaurantName || 'Unknown Restaurant',
        restaurantId: checkoutData.cartItems[0]?.restaurantId,
        items: checkoutData.cartItems, // Ensure this array is not empty
        subtotal: checkoutData.subtotal || 0,
        gst: checkoutData.gst || 0,
        deliveryFee: checkoutData.deliveryFee || 0,
        discount: checkoutData.discount || 0,
        finalAmount: checkoutData.grandTotal || 0, // Note: You used grandTotal in context
        couponCode: checkoutData.coupon?.code || null,
        orderId: generatedId,
        orderedAt: new Date().toISOString(),
      }

      // 2. Save the fully populated object
      saveOrder(orderPayload)

      // 3. Only now is it safe to clear the state
      resetCheckout()

      hasProcessed.current = true
    }
  }, [checkoutData, resetCheckout])

  return (
    <div className="checkout-container">
      <CheckoutProgress currentStep={4} />
      <div className="success-content">
        <FaCheckCircle
          className="success-icon"
          style={{fontSize: '48px', color: '#22c55e'}}
        />
        <h1 className="checkout-title">Order Placed Successfully!</h1>
        <p className="order-id-text">
          Your Order ID: <strong>{orderId || 'Generating...'}</strong>
        </p>
        <button
          className="checkout-next-btn success-btn"
          onClick={() => navigate('/')}
        >
          Back To Home
        </button>
      </div>
    </div>
  )
}

export default SuccessStep
