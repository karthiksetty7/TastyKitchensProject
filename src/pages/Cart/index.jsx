import {useState, useEffect, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {FaTrash, FaTimesCircle} from 'react-icons/fa'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CartEmpty from '../../components/CartEmpty'
import BillSummary from '../../components/BillSummary'
import {saveOrder} from '../../utils/orderHistoryStorage'
import {validateCoupon, calculateDiscount} from '../../utils/couponService'
import {
  calculateGST,
  getDeliveryFee,
  calculateFinalAmount,
  FREE_DELIVERY_THRESHOLD,
} from '../../utils/pricingService'

import {CheckoutContext} from '../../context/CheckoutContext'
import './index.css'

const Cart = () => {
  const {checkoutData, setCheckoutData} = useContext(CheckoutContext)

  // Use cartItems from context as initial state
  const [cartList, setCartList] = useState(checkoutData.cartItems || [])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(
    checkoutData.coupon || null,
  )
  const [couponError, setCouponError] = useState('')
  const navigate = useNavigate()

  const [usedCoupons, setUsedCoupons] = useState([])

  useEffect(() => {
    // Fetch from storage whenever the component mounts
    // or after a navigation/order placement
    const fetchUsedCoupons = () => {
      const saved = JSON.parse(localStorage.getItem('usedCoupons')) || []
      setUsedCoupons(saved)
    }
    fetchUsedCoupons()
  }, [])

  // This logic automatically updates because it pulls fresh data from localStorage on every render
  const availableCoupons = [
    {code: 'WELCOME50', desc: '₹50 OFF'},
    {code: 'FLAT100', desc: '₹100 OFF'},
    {code: 'SAVE20', desc: '20% OFF'},
    {code: 'FREESHIP', desc: 'Free Delivery'},
  ].filter(c => !usedCoupons.includes(c.code))

  // Sync internal state to Context whenever it changes
  const updateCartState = updatedCart => {
    setCartList(updatedCart)
    setCheckoutData(prev => ({...prev, cartItems: updatedCart}))
  }

  const emptyCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      setCartList([])
      setAppliedCoupon(null)
      setCouponCode('')
      setCheckoutData(prev => ({
        ...prev,
        cartItems: [],
        subtotal: 0,
        gst: 0,
        deliveryFee: 0,
        discount: 0,
        grandTotal: 0,
        coupon: null,
      }))
    }
  }

  const incrementCartItemQuantity = id => {
    const updatedCart = cartList.map(eachItem =>
      eachItem.id === id
        ? {...eachItem, quantity: eachItem.quantity + 1}
        : eachItem,
    )
    updateCartState(updatedCart)
  }

  const decrementCartItemQuantity = id => {
    const targetItem = cartList.find(eachItem => eachItem.id === id)
    if (!targetItem) return
    const updatedCart =
      targetItem.quantity === 1
        ? cartList.filter(eachItem => eachItem.id !== id)
        : cartList.map(eachItem =>
            eachItem.id === id
              ? {...eachItem, quantity: eachItem.quantity - 1}
              : eachItem,
          )
    updateCartState(updatedCart)
  }

  const applyCoupon = () => {
    const coupon = validateCoupon(couponCode)
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || []
    const isEligibleForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD

    if (!coupon) {
      setCouponError('Invalid Coupon Code')
    } else if (usedCoupons.includes(coupon.code)) {
      setCouponError('Coupon already used!')
    } else if (coupon.code === 'FREESHIP' && isEligibleForFreeDelivery) {
      setCouponError('Already eligible for FREE delivery! Save this for later.')
    } else {
      setAppliedCoupon(coupon)
      setCouponError('')
    }
    setCouponCode('')
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
  }

  // Calculate totals
  const subtotal = cartList.reduce(
    (acc, item) => acc + item.cost * item.quantity,
    0,
  )
  const gst = calculateGST(subtotal)
  const deliveryFee = getDeliveryFee(subtotal)
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal

  const {discount, deliveryDiscount} = calculateDiscount(
    appliedCoupon,
    subtotal,
    deliveryFee,
  )
  const totalDiscount = discount + deliveryDiscount
  const grandTotal = calculateFinalAmount({
    subtotal,
    deliveryFee,
    gst,
    discount: totalDiscount,
  })

  const onClickPlaceOrder = () => {
    // 1. Mark coupon as used BEFORE saving the order
    if (appliedCoupon) {
      const currentUsed = JSON.parse(localStorage.getItem('usedCoupons')) || []

      // Only update if not already present
      if (!currentUsed.includes(appliedCoupon.code)) {
        const updatedList = [...currentUsed, appliedCoupon.code]
        localStorage.setItem('usedCoupons', JSON.stringify(updatedList))
        setUsedCoupons(updatedList)
      }
    }

    // 2. Update the global context with the final cart values
    // We do NOT save the order or generate an orderId here anymore.
    // That happens only at the very end of the checkout process.
    setCheckoutData(prev => ({
      ...prev,
      cartItems: cartList,
      subtotal,
      gst,
      deliveryFee,
      discount: totalDiscount,
      grandTotal,
      coupon: appliedCoupon,
    }))

    // 3. Navigate to the next step in your checkout flow
    navigate('/checkout/address')
  }

  if (cartList.length === 0)
    return (
      <div className="cart-global-layout">
        <Header />
        <CartEmpty />
        <Footer />
      </div>
    )

  return (
    <div className="cart-global-layout">
      <Header />
      <div className="cart-page-container">
        <div className="cart-main-container">
          <Link
            to={`/restaurant/${cartList[0]?.restaurantId || ''}`}
            className="back-to-restaurant-link"
          >
            &larr; Back to {cartList[0]?.restaurantName || 'Restaurant'}
          </Link>

          <ul className="cart-list">
            {cartList.map(item => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details-content">
                  <p className="cart-item-name">{item.name}</p>
                  <div className="quantity-container">
                    <button
                      className="quantity-button"
                      onClick={() => decrementCartItemQuantity(item.id)}
                    >
                      -
                    </button>
                    <span className="quantity-text">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => incrementCartItemQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <p className="price-container">
                    ₹ {item.cost * item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {remainingForFreeDelivery > 0 && (
            <p className="free-delivery-hint">
              Add ₹{remainingForFreeDelivery} more for FREE delivery!
            </p>
          )}

          {appliedCoupon === null && availableCoupons.length > 0 && (
            <div className="available-coupons-container">
              <h3>Available Coupons</h3>
              <ul className="coupons-list">
                {availableCoupons.map(each => (
                  <li key={each.code}>
                    <strong>{each.code}</strong> → {each.desc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="coupon-wrapper">
            <input
              type="text"
              className="coupon-input"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Enter Coupon"
            />
            {appliedCoupon === null ? (
              <button className="apply-coupon-btn" onClick={applyCoupon}>
                Apply
              </button>
            ) : (
              <button className="remove-coupon-btn" onClick={removeCoupon}>
                <FaTimesCircle /> Remove
              </button>
            )}
          </div>
          {couponError && <p className="coupon-error">{couponError}</p>}

          <div className="summary-container">
            <BillSummary
              subtotal={subtotal}
              gst={gst}
              deliveryFee={deliveryFee}
              discount={totalDiscount}
              grandTotal={grandTotal}
              couponCode={appliedCoupon?.code}
            />
          </div>

          <div className="place-order-container">
            <button className="empty-cart-button" onClick={emptyCart}>
              <FaTrash /> Empty Cart
            </button>
            <button className="place-order-button" onClick={onClickPlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Cart
