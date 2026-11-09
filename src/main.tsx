import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Pastikan Cache Storage lama dibersihkan & Service Worker (/sw.js) aktif
// agar instalasi PWA / WebAPK di Ponsel (Android / iOS) & Desktop selalu berfungsi.
if ('caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      registration.update().catch(() => {});
    })
    .catch(() => {});
}
