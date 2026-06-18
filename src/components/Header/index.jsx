import {useState} from 'react'
import Cookies from 'js-cookie'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import './index.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isHomeActive = location.pathname === '/'
  const isFavoritesActive = location.pathname === '/favorites'
  const isOrdersActive = location.pathname === '/orders'
  const isAnalyticsActive = location.pathname === '/analytics' // Added for Analytics
  const isCartActive = location.pathname === '/cart'
  const isProfileActive = location.pathname === '/profile'

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    Cookies.remove('username')
    navigate('/login', {replace: true})
  }

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  return (
    <nav className="header-navbar">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <div className="header-logo-container">
            <img
              src="https://res.cloudinary.com/dlvle38po/image/upload/v1780917309/Frame_274_ezogyx.png"
              alt="website logo"
              className="header-logo"
            />
            <h1 className="header-logo-title">Tasty Kitchens</h1>
          </div>
        </Link>

        {!isMenuOpen && (
          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={toggleMenu}
            aria-label="open menu"
          >
            <svg
              className="hamburger-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#334155"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}

        <div
          className={`nav-menu-wrapper ${isMenuOpen ? 'show-mobile-menu' : ''}`}
        >
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link
                to="/"
                className={`nav-link ${isHomeActive ? 'active-nav' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link
                to="/favorites"
                className={`nav-link ${isFavoritesActive ? 'active-nav' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Favorites
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link
                to="/orders"
                className={`nav-link ${isOrdersActive ? 'active-nav' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
            </li>
            {/* Added Analytics link here with your original pattern */}
            <li className="nav-menu-item">
              <Link
                to="/analytics"
                className={`nav-link ${isAnalyticsActive ? 'active-nav' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link
                to="/cart"
                className={`nav-link ${isCartActive ? 'active-nav' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link
                to="/profile"
                className={`nav-link ${isProfileActive ? 'active-nav' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li className="nav-menu-item">
              <button
                type="button"
                className="logout-button"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </li>

            <li className="nav-menu-item mobile-close-item">
              <button
                type="button"
                className="mobile-menu-close-btn"
                onClick={toggleMenu}
                aria-label="close menu"
              >
                <svg
                  className="hamburger-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
