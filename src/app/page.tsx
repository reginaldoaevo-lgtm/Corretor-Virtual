import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Este é o ponto de partida que a Vercel precisa para ligar o React
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
