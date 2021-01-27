// TODO: look at a bundler for esri-leaflet: https://github.com/esri/esri-leaflet-bundler
import 'esri-leaflet-renderers';

export interface LayerConfig {
    url: string;
    type: string;
    entries: string;
}

/**
 * A class to get the layer from layer type. Layer type can be esriFeature, esriDynamic and ogcWMS
 *
 * @export
 * @class Layer
 */
export class Layer {
    // TODO: look at this plugin for support for more layer https://github.com/mapbox/leaflet-omnivore
    constructor() {}

    // WCS https://github.com/stuartmatthews/Leaflet.NonTiledLayer.WCS
}
