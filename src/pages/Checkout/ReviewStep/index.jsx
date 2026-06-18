import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {CheckoutContext} from '../../../context/CheckoutContext'
import CheckoutProgress from '../CheckoutProgress'
import BillSummary from '../../../components/BillSummary'
import './index.css'

const ReviewStep = () => {
  const {checkoutData} = useContext(CheckoutContext)
  const navigate = useNavigate()

  const {
    cartItems = [],
    subtotal,
    gst,
    deliveryFee,
    discount,
    grandTotal,
    coupon,
  } = checkoutData

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your order?')) {
      navigate('/')
    }
  }

  return (
    <div className="checkout-container">
      <CheckoutProgress currentStep={3} />
      <h1 className="checkout-title">Review Order</h1>

      <div className="review-box">
        <h3>Order Summary</h3>

        {/* Unified items list container */}
        <div className="review-items-list">
          {cartItems.map(item => (
            <div key={item.id} className="review-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹{item.cost * item.quantity}</span>
            </div>
          ))}
        </div>

        <hr className="divider" />

        {/* BillSummary is now styled to be transparent and fit inside */}
        <BillSummary
          subtotal={subtotal}
          gst={gst}
          deliveryFee={deliveryFee}
          discount={discount}
          grandTotal={grandTotal}
          couponCode={coupon?.code}
        />

        <div className="review-details">
          <p>
            <strong>Address:</strong> {checkoutData.address?.address}
          </p>
          <p>
            <strong>Payment:</strong> {checkoutData.paymentMethod}
          </p>
        </div>
      </div>

      <button
        className="checkout-next-btn"
        onClick={() => navigate('/checkout/success')}
      >
        Place Order
      </button>

      <button className="cancel-btn" onClick={handleCancel}>
        Cancel Order
      </button>
    </div>
  )
}

export default ReviewStep
