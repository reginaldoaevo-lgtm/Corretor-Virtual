import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // THIS LINE IS THE KEY TO DESIGN
import App from './App'

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
