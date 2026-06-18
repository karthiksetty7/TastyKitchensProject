// Write your code here
import {
  FaPinterestSquare,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <footer className="footer-container">
    <div className="footer-content">
      <div className="footer-logo-section">
        <img
          src="https://res.cloudinary.com/dlvle38po/image/upload/v1780917751/Group_7420_vzp4li.png"
          alt="website-footer-logo"
          className="footer-logo"
        />

        <h1 className="footer-title">Tasty Kitchens</h1>
      </div>

      <p className="footer-description">
        The only thing we are serious about is food. Contact us on
      </p>

      <div className="social-icons-container">
        <FaPinterestSquare
          data-testid="pintrest-social-icon"
          className="social-icon"
        />

        <FaInstagram
          data-testid="instagram-social-icon"
          className="social-icon"
        />

        <FaTwitter data-testid="twitter-social-icon" className="social-icon" />

        <FaFacebookSquare
          data-testid="facebook-social-icon"
          className="social-icon"
        />
      </div>
    </div>
  </footer>
)

export default Footer
