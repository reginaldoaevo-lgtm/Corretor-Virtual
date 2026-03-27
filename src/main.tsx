import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // 'A' maiúsculo para bater com o arquivo App.tsx

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
