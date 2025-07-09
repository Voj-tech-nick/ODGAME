// 1) Všechny importy musí být nahoře
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Leaflet a jeho CSS
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Cesty k ikonám
//(modrá ikona) import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
//(modrá ikona) import iconUrl       from 'leaflet/dist/images/marker-icon.png';
import puppetIcon     from './images/puppet_icon.png';
import shadowUrl     from 'leaflet/dist/images/marker-shadow.png';

// Vaše React aplikace
import App from './App';
import reportWebVitals from './reportWebVitals';

// 2) Zde – hned po importech – přepište výchozí ikonu:
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: puppetIcon,  // stejná cesta k vašemu obrazu
  iconUrl:       puppetIcon,
  shadowUrl:     shadowUrl,
  iconSize:      [50, 50],     // upravuje velikost
  iconAnchor:    [25, 50],     // [šířka/2, výška]
  shadowSize:    [50, 50],
  shadowAnchor:  [25, 50],
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
