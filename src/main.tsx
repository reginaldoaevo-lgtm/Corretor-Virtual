import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // THIS LINE IS THE ONE THAT ACTIVATES THE GOLD!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
