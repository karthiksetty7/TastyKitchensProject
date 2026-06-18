import {StrictMode} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {createRoot} from 'react-dom/client'
import {CheckoutProvider} from './context/CheckoutContext'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CheckoutProvider>
        <App />
      </CheckoutProvider>
    </BrowserRouter>
  </StrictMode>,
)
