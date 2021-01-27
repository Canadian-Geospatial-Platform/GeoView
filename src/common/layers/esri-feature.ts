import { featureLayer } from 'esri-leaflet';

import { Layer, LayerConfig } from './layer';

/**
 * a class to add esri feature layer
 */
export class EsriFeature extends Layer {
    /**
     * Add a ESRI feature layer to the map.
     *
     * @param {object} map the Leaflet map
     * @param {LayerConfig} layer the layer configuration
     * @returns {feat is object}
     */
    addEsriFeature(map: any, layer: LayerConfig) {
        const feat = featureLayer({
            url: layer.url,
        });

        (feat as any).type = layer.type;
        feat.addTo(map);

        return feat;
    }
}
