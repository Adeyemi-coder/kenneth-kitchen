import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// CORRECTED: Using the variable fonts installed in your project
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/dm-sans';

// FIX: Activate data-saver mode on slow networks or when data-saver is enabled
const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (conn?.saveData || /2g/.test(conn?.effectiveType || '')) {
  document.documentElement.dataset.saver = 'true';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);