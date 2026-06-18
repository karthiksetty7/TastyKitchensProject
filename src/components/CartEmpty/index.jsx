// Write your code here
import {Link} from 'react-router-dom'

import './index.css'

const CartEmpty = () => (
  <div className="empty-cart-container">
    <img
      src="https://res.cloudinary.com/dlvle38po/image/upload/v1780918942/cooking_1_y1xy8a.png"
      alt="empty cart"
      className="empty-cart-image"
    />

    <h1 className="empty-cart-heading">No Order Yet!</h1>

    <p className="empty-cart-description">
      Your cart is empty. Add something from the menu.
    </p>

    <Link to="/">
      <button type="button" className="order-now-button">
        Order Now
      </button>
    </Link>
  </div>
)

export default CartEmpty
