import {useState} from 'react'
import Cookies from 'js-cookie'
import {Navigate, useNavigate} from 'react-router-dom'

import './index.css'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const navigate = useNavigate()
  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />
  }

  const submitSuccess = jwtTokenValue => {
    Cookies.set('jwt_token', jwtTokenValue, {
      expires: 30,
      path: '/',
    })

    Cookies.set('username', username, {
      expires: 30,
      path: '/',
    })

    navigate('/', {replace: true})
  }

  const submitFailure = error => {
    setShowError(true)
    setErrorMsg(error)
  }

  const submitForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()

    if (response.ok) {
      submitSuccess(data.jwt_token)
    } else {
      submitFailure(data.error_msg)
    }
  }

  return (
    <div className="login-bg">
      {/* Mobile Top Image Container */}
      <div className="mobile-login-image-container">
        <img
          src="https://res.cloudinary.com/dlvle38po/image/upload/v1780919799/Rectangle_1457_rrnd1h.png"
          alt="website login"
          className="mobile-login-image"
        />
      </div>

      {/* Main Login Form Area */}
      <div className="login-card-container">
        <form className="login-form-card" onSubmit={submitForm}>
          <div className="logo-container">
            <img
              src="https://res.cloudinary.com/dlvle38po/image/upload/v1780917309/Frame_274_ezogyx.png"
              alt="website logo"
              className="login-logo"
            />
            <h1 className="login-title">Tasty Kitchens</h1>
          </div>

          <h1 className="login-heading">Welcome Back</h1>
          <p className="login-subheading">
            Please enter your credentials to look at delicious updates.
          </p>

          <div className="input-container">
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="input-field"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </div>

          <div className="input-container">
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="input-field"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>

          {showError && (
            <div className="error-badge">
              <p className="error-message">*{errorMsg}</p>
            </div>
          )}
        </form>
      </div>

      {/* Desktop Right Image Container */}
      <div className="desktop-login-image-container">
        <div className="desktop-image-overlay"></div>
        <img
          src="https://res.cloudinary.com/dlvle38po/image/upload/v1780917409/Rectangle_1456_jcftbq.png"
          alt="website login"
          className="desktop-login-image"
        />
      </div>
    </div>
  )
}

export default LoginForm
