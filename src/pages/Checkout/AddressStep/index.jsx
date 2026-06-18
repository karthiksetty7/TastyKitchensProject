import {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {CheckoutContext} from '../../../context/CheckoutContext'
import {getAddresses} from '../../../utils/addressStorage'
import CheckoutProgress from '../CheckoutProgress'
import './index.css'

const AddressStep = () => {
  const {setCheckoutData} = useContext(CheckoutContext)
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <div className="checkout-container">
      <CheckoutProgress currentStep={1} />

      <div className="checkout-content">
        <h1 className="checkout-title">Select Delivery Address</h1>

        <div className="address-list">
          {getAddresses().map(addr => (
            <div
              key={addr.id}
              className={`address-card ${
                selected?.id === addr.id ? 'active' : ''
              }`}
              onClick={() => setSelected(addr)}
            >
              <div className="radio-indicator" />
              <div className="address-text">
                <span className="address-label">{addr.label}</span>
                <p className="address-details">{addr.address}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="checkout-next-btn"
          disabled={!selected}
          onClick={() => {
            setCheckoutData(p => ({...p, address: selected}))
            navigate('/checkout/payment')
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}
export default AddressStep
