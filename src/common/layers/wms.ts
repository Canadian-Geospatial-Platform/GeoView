import L, { Layer } from 'leaflet';

import WMSCapabilities from 'wms-capabilities';

import { LayerConfig } from './layer';
import { getXMLHttpRequest } from '../utilities';

// TODO: this needs cleaning some layer type like WMS are part of react-leaflet and can be use as a component

/**
 * a class to add wms layer
 *
 * @export
 * @class WMS
 */
export class WMS {
    // TODO: try to avoid getCapabilities for WMS. Use Web Presence metadata return info to store, legend image link, layer name, and other needed properties.
    // * We may have to do getCapabilites if we want to add layers not in the catalog
    /**
     * Add a WMS layer to the map.
     *
     * @param {LayerConfig} layer the layer configuration
     * @return {Promise<Layer | string>} layers to add to the map
     */
    add(layer: LayerConfig): Promise<Layer | string> {
        let { url } = layer;

        // if url has a '?' do not append to avoid errors, user must add this manually
        if (layer.url.indexOf('?') === -1) {
            url += '?service=WMS&version=1.3&request=GetCapabilities';
        }

        const data = getXMLHttpRequest(url);

        const geo = new Promise<Layer | string>((resolve) => {
            data.then((value: string) => {
                if (value !== '{}') {
                    // check if entries exist
                    let isValid = false;
                    const json = new WMSCapabilities(value).toJSON();
                    json.Capability.Layer.Layer.forEach((item) => {
                        if (layer.entries?.match(item.Name)) isValid = true;
                    });

                    if (isValid) {
                        const wms = L.tileLayer.wms(layer.url, {
                            layers: layer.entries,
                            format: 'image/png',
                            transparent: true,
                            attribution: '',
                        });

                        resolve(wms);
                    } else {
                        resolve('{}');
                    }
                } else {
                    resolve('{}');
                }
            });
        });

        return new Promise((resolve) => resolve(geo));
    }
}
