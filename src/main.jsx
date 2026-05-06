import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './i18n';
import App from './App';

// Possum Posse design-system tokens — must come AFTER Mantine's reset
// (which is imported inside App.jsx) so brand vars win on cascade ties.
import './assets/styles/possum-tokens.css';

gsap.registerPlugin(ScrollTrigger);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
