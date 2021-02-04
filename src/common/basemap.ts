/* eslint-disable lines-between-class-members */
/**
 * A class to get a BasemapGroup for a define projection. For the moment, we a  Web Mercator and a LCC basemap.
 * We intend to have only one basemap per projection to avoid the need of a basemap switcher.
 * If we add a new projection, we need to also add a basemap.
 *
 * @export
 * @class Basemap
 */
/**
 *basemap basic properties
 */
interface BasemapConfig {
    tms: boolean;
    tileSize: number;
    attribution: boolean;
    noWrap: boolean;
}
/**
 *single basemap layer
 */
interface BasemapLayer {
    id: string;
    url: string;
    options: BasemapConfig;
    opacity: number;
}
/**
 *Attribution value
 */
export interface Attribution {
    'en-CA': string;
    'fr-CA': string;
}
/**
 *basemap constructor properties
 */
export interface BasemapGroupConfig {
    id: string;
    shaded: boolean;
    labeled: boolean;
}
export class Basemap {
    private language = '';

    private basemapID = '';
    private shaded: boolean;

    private labeled: boolean;
    private crsID: number;
    private basemapLayers: BasemapLayer[];
    basemapsList = {
        3978: {
            transport:
                'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3978/MapServer/WMTS/tile/1.0.0/CBMT_CBCT_GEOM_3978/default/default028mm/{z}/{y}/{x}.jpg',
            simple:
                'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/Simple/MapServer/WMTS/tile/1.0.0/Simple/default/default028mm/{z}/{y}/{x}.jpg',
            shaded:
                'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBME_CBCE_HS_RO_3978/MapServer/WMTS/tile/1.0.0/CBMT_CBCT_GEOM_3978/default/default028mm/{z}/{y}/{x}.jpg',
            label:
                'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/xxxx_TXT_3978/MapServer/WMTS/tile/1.0.0/xxxx_TXT_3978/default/default028mm/{z}/{y}/{x}.jpg',
        },
        3857: {
            transport:
                'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg',
            label:
                'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/xxxx_TXT_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_xxxx_TXT_3857/default/default028mm/{z}/{y}/{x}.jpg',
        },
    };
    constructor(language: string, crsID: number, Basemapconfig: BasemapGroupConfig) {
        this.language = language;
        this.basemapID = Basemapconfig.id;
        this.shaded = Basemapconfig.shaded;
        this.labeled = Basemapconfig.labeled;
        this.crsID = crsID;
        this.basemapLayers = this.Buildbasemapgroup;
    }
    private basemapConfig: BasemapConfig = {
        tms: false,
        tileSize: 256,
        attribution: false,
        noWrap: false,
    };
    get Layers(): BasemapLayer[] {
        return this.basemapLayers;
    }
    // attribution to add the the map
    private attributionVal: Attribution = {
        'en-CA': '© Her Majesty the Queen in Right of Canada, as represented by the Minister of Natural Resources',
        'fr-CA': '© Sa Majesté la Reine du Chef du Canada, représentée par le ministre des Ressources naturelles',
    };
    // build basemap group from both settings and user input
    get Buildbasemapgroup(): BasemapLayer[] {
        // get proper geometry url
        const basemapLayers: BasemapLayer[] = [];
        let mainBasemapOpacity = 1;
        // const basemaps: BasemapProps[] = this.basemapsSettings.filter((basemapsSetting) => basemapsSetting.crsID === this.crsID)[0]
        //     .basemaps;
        if (this.shaded !== false) {
            basemapLayers.push({
                id: 'shaded',
                url: this.basemapsList[this.crsID].shaded,
                options: this.basemapConfig,
                opacity: mainBasemapOpacity,
            });
            mainBasemapOpacity = 0.8;
        }
        basemapLayers.push({
            id: this.basemapID || 'transport',
            url: this.basemapsList[this.crsID][this.basemapID] || this.basemapsList[this.crsID].transport,
            options: this.basemapConfig,
            opacity: mainBasemapOpacity,
        });

        if (this.labeled !== false) {
            // get proper label url
            this.language === 'en-CA'
                ? basemapLayers.push({
                      id: 'label',
                      url: this.basemapsList[this.crsID].label.replaceAll('xxxx', 'CBMT'),
                      options: this.basemapConfig,
                      opacity: 1,
                  })
                : basemapLayers.push({
                      id: 'label',
                      url: this.basemapsList[this.crsID].label.replaceAll('xxxx', 'CBCT'),
                      options: this.basemapConfig,
                      opacity: 1,
                  });
        }
        return basemapLayers;
    }
    get attribution(): Attribution {
        return this.attributionVal;
    }
}
