import {useContext} from 'react' // Added useContext
import {Link, useNavigate} from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import {getOrderHistory} from '../../utils/orderHistoryStorage'
import {CheckoutContext} from '../../context/CheckoutContext' // Added Context
import {FaRegCheckCircle, FaUndoAlt} from 'react-icons/fa'
import './index.css'

const OrderHistory = () => {
  const orders = getOrderHistory() || []
  const navigate = useNavigate()

  // Access setCheckoutData from your context
  const {setCheckoutData} = useContext(CheckoutContext)

  const formatOrderDate = isoString => {
    if (!isoString) return 'N/A'
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(isoString).toLocaleDateString('en-IN', options)
  }

  const handleRepeatOrder = pastOrder => {
    if (!pastOrder || !pastOrder.items) return

    const existingCart = JSON.parse(localStorage.getItem('cartData')) || []

    // 1. Restaurant Guard Logic
    if (existingCart.length > 0) {
      const currentCartRestaurantId = existingCart.find(
        item => item.restaurantId,
      )?.restaurantId

      if (String(currentCartRestaurantId) !== String(pastOrder.restaurantId)) {
        const shouldClearCart = window.confirm(
          `Your cart contains items from a different restaurant. Discard them and start a new order from ${
            pastOrder.restaurantName || 'the restaurant'
          }?`,
        )

        if (shouldClearCart) {
          localStorage.removeItem('cartData')
        } else {
          return
        }
      }
    }

    // 2. Populate Context with items from the selected order
    // We recreate the items structure as expected by your checkout flow
    const newCart = pastOrder.items.map(item => ({
      ...item,
      restaurantId: pastOrder.restaurantId,
      restaurantName: pastOrder.restaurantName,
    }))

    setCheckoutData(prev => ({
      ...prev,
      cartItems: newCart,
      coupon: null, // Reset coupon on re-order
      subtotal: 0, // Forces Cart to re-calculate totals
    }))

    // 3. Navigate to checkout flow
    alert('✅ Items added to cart successfully')
    navigate('/cart')
  }

  const renderEmptyHistoryView = () => (
    <div className="empty-history-container">
      <img
        src="https://res.cloudinary.com/dlvle38po/image/upload/v1780918942/cooking_1_y1xy8a.png"
        alt="no orders yet"
        className="empty-history-image"
      />
      <h1 className="empty-history-heading">No Orders Placed Yet</h1>
      <p className="empty-history-description">
        Your order history timeline looks completely clean. Let's find some
        delicious food!
      </p>
      <Link to="/">
        <button type="button" className="order-now-btn">
          Order Now
        </button>
      </Link>
    </div>
  )

  return (
    <>
      <Header />
      <div className="order-history-page-bg">
        <div className="order-history-content-wrapper">
          <h1 className="history-main-title">My Orders 📦</h1>

          {orders.length === 0 ? (
            renderEmptyHistoryView()
          ) : (
            <ul className="orders-timeline-list">
              {orders.map(eachOrder => (
                <li key={eachOrder.orderId} className="order-history-card">
                  <div className="order-card-header">
                    <div>
                      <h2 className="order-restaurant-title">
                        {eachOrder.restaurantName || 'Unknown Restaurant'}
                      </h2>
                      <p className="order-id-tag">ID: {eachOrder.orderId}</p>
                    </div>
                    <div className="order-status-badge">
                      <FaRegCheckCircle className="badge-check-icon" />
                      <span>Delivered</span>
                    </div>
                  </div>

                  <ul className="order-items-breakdown-list">
                    {eachOrder.items?.map(item => (
                      <li key={item.id} className="order-item-row">
                        <span className="order-item-name-dot">
                          {item.name || 'Item'}{' '}
                          <strong className="item-qty-multiplier">
                            x{item.quantity || 0}
                          </strong>
                        </span>
                        <span className="order-item-row-cost">
                          ₹{(item.cost || 0) * (item.quantity || 0)}
                        </span>
                      </li>
                    ))}

                    <li className="order-item-row" style={{marginTop: '8px'}}>
                      <span className="order-item-name-dot">GST (5%)</span>
                      <span className="order-item-row-cost">
                        ₹{eachOrder.gst ?? 0}
                      </span>
                    </li>

                    {eachOrder.deliveryFee !== undefined && (
                      <li className="order-item-row">
                        <span className="order-item-name-dot">
                          {eachOrder.deliveryFee === 0
                            ? 'Delivery (Free)'
                            : 'Delivery Fee'}
                        </span>
                        <span className="order-item-row-cost">
                          ₹{eachOrder.deliveryFee ?? 0}
                        </span>
                      </li>
                    )}

                    {eachOrder.couponCode &&
                      eachOrder.couponCode !== 'NONE' &&
                      (eachOrder.discount ?? 0) > 0 && (
                        <li
                          className="order-item-row"
                          style={{color: '#065f46', fontWeight: '600'}}
                        >
                          <span className="order-item-name-dot">
                            Coupon ({eachOrder.couponCode})
                          </span>
                          <span className="order-item-row-cost">
                            -₹{eachOrder.discount}
                          </span>
                        </li>
                      )}
                  </ul>

                  <hr className="order-card-divider" />

                  <div className="order-card-footer">
                    <div>
                      <p className="footer-timestamp-label">Ordered On</p>
                      <p className="footer-timestamp-value">
                        {formatOrderDate(eachOrder.orderedAt)}
                      </p>
                    </div>
                    <div className="footer-bill-summary">
                      <p className="footer-total-value">
                        Total: ₹{eachOrder.finalAmount ?? 0}
                      </p>
                      <button
                        type="button"
                        className="repeat-order-action-btn"
                        onClick={() => handleRepeatOrder(eachOrder)}
                      >
                        <FaUndoAlt className="repeat-btn-icon" />
                        <span>Order Again</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderHistory
