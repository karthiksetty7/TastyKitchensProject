import {useState, useEffect, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {FaTrash, FaTimesCircle} from 'react-icons/fa'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CartEmpty from '../../components/CartEmpty'
import BillSummary from '../../components/BillSummary'
import {redeemRewardPoints, getRewardPoints} from '../../utils/rewardService'
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

  const [cartList, setCartList] = useState(checkoutData.cartItems || [])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(
    checkoutData.coupon || null,
  )
  const [couponError, setCouponError] = useState('')
  const [usedCoupons, setUsedCoupons] = useState([])
  const [rewardDiscount, setRewardDiscount] = useState(
    checkoutData.rewardDiscount || 0,
  )
  const [rewardError, setRewardError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsedCoupons = () => {
      const saved = JSON.parse(localStorage.getItem('usedCoupons')) || []
      setUsedCoupons(saved)
    }
    fetchUsedCoupons()
  }, [])

  const availableCoupons = [
    {code: 'WELCOME50', desc: '₹50 OFF'},
    {code: 'FLAT100', desc: '₹100 OFF'},
    {code: 'SAVE20', desc: '20% OFF'},
    {code: 'FREESHIP', desc: 'Free Delivery'},
  ].filter(c => !usedCoupons.includes(c.code))

  const updateCartState = updatedCart => {
    setCartList(updatedCart)
    setRewardDiscount(0)
    setCheckoutData(prev => ({
      ...prev,
      cartItems: updatedCart,
      rewardDiscount: 0,
    }))
  }

  const emptyCart = () => {
    if (window.confirm('Clear your entire cart?')) {
      setCartList([])
      setAppliedCoupon(null)
      setRewardDiscount(0)
      setCheckoutData(prev => ({
        ...prev,
        cartItems: [],
        subtotal: 0,
        gst: 0,
        deliveryFee: 0,
        discount: 0,
        grandTotal: 0,
        coupon: null,
        rewardDiscount: 0,
      }))
    }
  }

  const incrementCartItemQuantity = id => {
    updateCartState(
      cartList.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    )
  }

  const decrementCartItemQuantity = id => {
    const updated = cartList
      .map(item =>
        item.id === id ? {...item, quantity: item.quantity - 1} : item,
      )
      .filter(item => item.quantity > 0)
    updateCartState(updated)
  }

  const handleRedeemPoints = () => {
    const currentPoints = getRewardPoints()

    // 1. Logic: Cap discount at 30% of the subtotal
    const maxDiscountAllowed = Math.floor(subtotal * 0.3)

    // 2. Logic: Each 100 points = 50 rupees
    const pointsValueInRupees = Math.floor(currentPoints / 100) * 50

    // 3. The actual discount is the lower of the two
    const eligibleDiscount = Math.min(maxDiscountAllowed, pointsValueInRupees)

    if (eligibleDiscount <= 0) {
      setRewardError(
        maxDiscountAllowed === 0
          ? 'Add more items to unlock point redemption!'
          : 'Need at least 100 points to redeem!',
      )
      return
    }

    // 4. Calculate how many points to actually deduct
    const pointsToDeduct = (eligibleDiscount / 50) * 100

    if (redeemRewardPoints(pointsToDeduct)) {
      setRewardDiscount(eligibleDiscount)
      setRewardError('')
    }
  }

  const applyCoupon = () => {
    const coupon = validateCoupon(couponCode)
    if (!coupon) setCouponError('Invalid Coupon')
    else if (usedCoupons.includes(coupon.code))
      setCouponError('Coupon already used!')
    else {
      setAppliedCoupon(coupon)
      setCouponError('')
    }
    setCouponCode('')
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
  }

  // --- Calculations ---
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

  const grandTotal =
    calculateFinalAmount({
      subtotal,
      deliveryFee,
      gst,
      discount: totalDiscount,
    }) - rewardDiscount

  const onClickPlaceOrder = () => {
    if (appliedCoupon) {
      const currentUsed = JSON.parse(localStorage.getItem('usedCoupons')) || []
      if (!currentUsed.includes(appliedCoupon.code)) {
        const updatedList = [...currentUsed, appliedCoupon.code]
        localStorage.setItem('usedCoupons', JSON.stringify(updatedList))
        setUsedCoupons(updatedList)
      }
    }
    setCheckoutData(prev => ({
      ...prev,
      cartItems: cartList,
      subtotal,
      gst,
      deliveryFee,
      discount: totalDiscount + rewardDiscount,
      grandTotal,
      coupon: appliedCoupon,
      rewardDiscount,
    }))
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

          <div className="reward-redemption-container">
            <p className="reward-info-text">
              🏆 Available Points: <strong>{getRewardPoints()}</strong>
            </p>
            {rewardDiscount === 0 ? (
              <button
                onClick={handleRedeemPoints}
                className="redeem-button"
                disabled={getRewardPoints() < 100}
              >
                Redeem 100 Points for ₹50
              </button>
            ) : (
              <p className="reward-applied-text">
                ✅ Reward Applied: -₹{rewardDiscount}
              </p>
            )}
            {rewardError && <p className="coupon-error">{rewardError}</p>}
          </div>

          <div className="summary-container">
            <BillSummary
              subtotal={subtotal}
              gst={gst}
              deliveryFee={deliveryFee}
              discount={totalDiscount + rewardDiscount}
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
