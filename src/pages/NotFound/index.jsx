// Write your code here
import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <>
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dlvle38po/image/upload/v1780919023/erroring_1_lw0ag2.png"
        alt="not found"
        className="not-found-image"
      />

      <h1 className="not-found-heading">Page Not Found</h1>

      <p className="not-found-description">
        We are sorry, the page you requested could not be found.
      </p>

      <Link to="/">
        <button type="button" className="home-page-button">
          Home Page
        </button>
      </Link>
    </div>
  </>
)

export default NotFound
