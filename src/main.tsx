import React from 'react'
import ReactDOM from 'react-dom/client'
// Importe garantindo que o "A" seja maiúsculo como no seu arquivo
import App from './App'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
