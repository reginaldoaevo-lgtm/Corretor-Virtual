import React from 'react'
import ReactDOM from 'react-dom/client'
// Import ensuring that the "A" is capitalized as in your file
import App from './App'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
