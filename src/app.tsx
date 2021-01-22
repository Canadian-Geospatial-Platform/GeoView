import React from 'react';
import ReactDOM from 'react-dom';

// Leaflet icons import to solve issues 4968
import { Icon, Marker } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import api from './api/api';

import '../node_modules/leaflet/dist/leaflet.css';
import '../public/css/style.css';

import AppStart from './core/app-start';

// hack for default leaflet icon: https://github.com/Leaflet/Leaflet/issues/4968
// TODO: put somewhere else
const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
Marker.prototype.options.icon = DefaultIcon;

/**
 * initialize the app and render it to root element
 */
function init() {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);

    ReactDOM.render(<AppStart />, document.getElementById('root'));
}

// app object to be exported with the api for outside use
const app = {
    init,
    api,
};

// freeze variable name so a variable with same name can't be defined from outside
Object.freeze(app);

// export the app globally
window.app = app;
