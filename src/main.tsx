import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Importing the main component App.tsx
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
