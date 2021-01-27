import L from 'leaflet';

import { Layer } from './layer';

// TODO: this needs cleaning some layer type like WMS are part of react-leaflet and can be use as a component

/**
 * a class to add wms layer
 */
export class WMS extends Layer {
    // TODO: try to avoid getCapabilities for WMS. Use Web Presence metadata return info to store, legend image link, layer name, and other needed properties.
    // in fact, to this for all the layer type
    /**
     * Add a WMS layer to the map.
     *
     * @param {object} map the Leaflet map
     * @param {LayerConfig} layer the layer configuration
     * @returns {wms is object}
     */
    addWMS(map: any, layer: LayerConfig) {
        let wms: any = {};
        wms = L.tileLayer.wms(layer.url, {
            layers: layer.entries,
            format: 'image/png',
            transparent: true,
            attribution: '',
        });

        (wms as any).type = layer.type;
        wms.addTo(map);

        return wms;
    }
}
