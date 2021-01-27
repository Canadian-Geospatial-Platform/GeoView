import { dynamicMapLayer } from 'esri-leaflet';

import { Layer, LayerConfig } from './layer';

/**
 * a class to add esri dynamic layer
 */
export class EsriDynamic extends Layer {
    /**
     * Add a ESRI dynamic layer to the map.
     *
     * @param {object} map the Leaflet map
     * @param {LayerConfig} layer the layer configuration
     * @returns {feat is object}
     */
    addEsriDynamic(map: any, layer: LayerConfig) {
        const feat = dynamicMapLayer({
            url: layer.url,
            layers: layer.entries.split(',').map((item: string) => {
                return parseInt(item, 10);
            }),
            attribution: '',
        });

        (feat as any).type = layer.type;
        feat.addTo(map);

        return feat;
    }
}
