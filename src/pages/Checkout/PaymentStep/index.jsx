import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {CheckoutContext} from '../../../context/CheckoutContext'
import CheckoutProgress from '../CheckoutProgress'
import './index.css'

const PaymentStep = () => {
  const {checkoutData, setCheckoutData} = useContext(CheckoutContext)
  const navigate = useNavigate()

  const paymentMethods = ['Credit Card', 'UPI', 'COD']

  return (
    <div className="checkout-container">
      <CheckoutProgress currentStep={2} />

      <div className="checkout-content">
        <h1 className="checkout-title">Select Payment Method</h1>

        <div className="payment-list">
          {paymentMethods.map(m => (
            <div
              key={m}
              className={`payment-card ${
                checkoutData.paymentMethod === m ? 'active' : ''
              }`}
              onClick={() =>
                setCheckoutData({...checkoutData, paymentMethod: m})
              }
            >
              <div className="radio-indicator" />
              <span className="payment-label">{m}</span>
            </div>
          ))}
        </div>

        <button
          className="checkout-next-btn"
          disabled={!checkoutData.paymentMethod}
          onClick={() => navigate('/checkout/review')}
        >
          Next
        </button>
      </div>
    </div>
  )
}
export default PaymentStep
