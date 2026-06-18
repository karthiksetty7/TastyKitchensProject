import {useEffect, useState, useContext, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {FaCheckCircle} from 'react-icons/fa'
import CheckoutProgress from '../CheckoutProgress'
import {CheckoutContext} from '../../../context/CheckoutContext'
import {saveOrder} from '../../../utils/orderHistoryStorage'
// 1. Import the rewards utility
import {addRewardPoints} from '../../../utils/rewardService'

import './index.css'

const SuccessStep = () => {
  const navigate = useNavigate()
  // 2. Add refreshPoints to your context destructuring
  const {checkoutData, resetCheckout, refreshPoints} =
    useContext(CheckoutContext)
  const [orderId, setOrderId] = useState('')
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (!hasProcessed.current && checkoutData.cartItems.length > 0) {
      const generatedId = `ORD-${Date.now().toString().slice(-6)}`
      setOrderId(generatedId)

      // 3. Calculate Reward Points Earned (1 point per 10 rupees)
      const earnedPoints = addRewardPoints(checkoutData.grandTotal)

      const orderPayload = {
        restaurantName:
          checkoutData.cartItems[0]?.restaurantName || 'Unknown Restaurant',
        restaurantId: checkoutData.cartItems[0]?.restaurantId,
        items: checkoutData.cartItems,
        subtotal: checkoutData.subtotal || 0,
        gst: checkoutData.gst || 0,
        deliveryFee: checkoutData.deliveryFee || 0,
        discount: checkoutData.discount || 0,
        finalAmount: checkoutData.grandTotal || 0,
        couponCode: checkoutData.coupon?.code ?? 'NONE',
        orderId: generatedId,
        orderedAt: new Date().toISOString(),
        earnedPoints, // 4. Include this in your saved order history
        rewardDiscount: checkoutData.rewardDiscount || 0,
      }

      saveOrder(orderPayload)

      // 5. Clear state and trigger a refresh of the global points state
      resetCheckout()
      refreshPoints()

      hasProcessed.current = true
    }
  }, [checkoutData, resetCheckout, refreshPoints])

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
