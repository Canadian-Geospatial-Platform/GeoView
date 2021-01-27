import L, { Map } from 'leaflet';

import { Layer } from './layer';

import api from '../../api/api';

/**
 * Class used to add geojson layer to the map
 */
export class GeoJSON extends Layer {
    /**
     * used to reference the map
     */
    private map: Map;

    layers: L.GeoJSON[] = [];

    /**
     * initialize the geojson url and listens to add events from outside
     * @param map a reference to the map
     */
    constructor(map: Map) {
        super();

        this.map = map;

        // will be used to listen to outside events to add json
        api.on('geojson/add', (payload) => {
            // add json from outside
            this.add(payload.url);
        });
    }

    /**
     * Load geojosn from a file and then send it as a string using the callback
     * @param url the file url
     * @param callback callback function after the geojson is loaded
     */
    load(url: string, callback: (data: string) => void): void {
        const jsonObj = new XMLHttpRequest();
        jsonObj.overrideMimeType('application/json');
        jsonObj.open('GET', url, true);
        jsonObj.onreadystatechange = () => {
            if (jsonObj.readyState === 4 && jsonObj.status === 200) {
                if (callback) callback(jsonObj.responseText);
            }
        };
        jsonObj.send(null);
    }

    /**
     * Add a geojson to the map
     */
    add(url: string): void {
        this.load(url, (data) => {
            console.log(url);
            // parse the json string and convert it to a json object
            const featureCollection = JSON.parse(data);

            // add the geojson to the map
            const geojson = L.geoJSON(featureCollection, {
                // add styling
                style: (feature) => {
                    if (feature?.geometry.type === 'Polygon') {
                        switch (feature.properties.number) {
                            case 'One':
                                return { color: '#ff0000' };
                            case 'Two':
                                return { color: '#0000ff' };
                            default:
                                return { color: '#696969' };
                        }
                    } else if (feature?.geometry.type === 'LineString') {
                        return {
                            color: '#000000',
                            weight: 5,
                            opacity: 0.65,
                        };
                    }

                    return {};
                },
            });

            geojson.addTo(this.map);

            this.layers.push(geojson);
        });
    }

    /**
     * Remove a geojson layer from the map
     * @param index the index of the layer to be removed
     */
    remove(index: number): void {
        this.layers[index].removeFrom(this.map);

        this.layers.splice(index, 1);
    }
}
