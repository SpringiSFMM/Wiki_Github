import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// Axios-Konfiguration für alle Anfragen
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Globaler Fehlerhandler für unbehandelte Promise-Fehler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unbehandelte Promise-Ablehnung:', event.reason);
});

// Demo-Token für Entwicklung (falls noch Code im Frontend auf Token prüft)
localStorage.setItem('auth_token', 'demo-token-12345');

// Anfrage-Interceptor hinzufügen
axios.interceptors.request.use(
  (config) => {
    console.log(`API-Anfrage: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Fehler bei API-Anfrage:', error);
    return Promise.reject(error);
  }
);

// Antwort-Interceptor hinzufügen
axios.interceptors.response.use(
  (response) => {
    console.log(`API-Antwort für: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Fehler bei API-Antwort:', error);
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
