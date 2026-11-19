import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { WishProvider } from './context/WishContext.jsx'
import { ReviewsProvider } from './context/ReviewsContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './styles.css'
import './styles-extra.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
          <ProductsProvider>
            <SettingsProvider>
              <WishProvider>
                <ReviewsProvider>
                  <CartProvider>
                    <App />
                  </CartProvider>
                </ReviewsProvider>
              </WishProvider>
            </SettingsProvider>
          </ProductsProvider>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
