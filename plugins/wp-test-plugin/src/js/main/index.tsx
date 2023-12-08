import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.scss';

ReactDOM.createRoot(document.getElementById('wp-test-plugin-settings')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
