/* eslint-disable lines-between-class-members */
/**
 * A class to get a BasemapGroup for a define projection. For the moment, we a  Web Mercator and a LCC basemap.
 * We intend to have only one basemap per projection to avoid the need of a basemap switcher.
 * If we add a new projection, we need to also add a basemap.
 *
 * @export
 * @class BasemapGroup
 */
export class BasemapGroup {
    private language = '';

    private basemapID = '';
    private shaded: boolean;

    private labeled: boolean;
    private crsID: number;
    private basemaps: BasemapOptions[];

    constructor(language: string, basemapID: string, crsID: number, shaded: boolean, labeled: boolean) {
        this.language = language;
        this.basemapID = basemapID;
        this.shaded = shaded;
        this.labeled = labeled;
        this.crsID = crsID;
        this.basemaps = this.Buildbasemapgroup;
    }

    /* list of different basemaps, it will be part of independent setting file
     */
    private basemapsSettings: BasemapSettings[] = [
        // lcc
        {
            crsID: 3978,
            basemaps: [
                {
                    id: 'SHADED',
                    url:
                        'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBME_CBCE_HS_RO_3978/MapServer/WMTS/tile/1.0.0/CBMT_CBCT_GEOM_3978/default/default028mm/{z}/{y}/{x}.jpg',
                },
                {
                    id: 'LBL',
                    url:
                        'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/xxxx_TXT_3978/MapServer/WMTS/tile/1.0.0/xxxx_TXT_3978/default/default028mm/{z}/{y}/{x}.jpg',
                },
                {
                    id: 'CBMT',
                    url:
                        'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3978/MapServer/WMTS/tile/1.0.0/CBMT_CBCT_GEOM_3978/default/default028mm/{z}/{y}/{x}.jpg',
                },
                {
                    id: 'SIMPLE',
                    url:
                        'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/Simple/MapServer/WMTS/tile/1.0.0/Simple/default/default028mm/{z}/{y}/{x}.jpg',
                },
            ],
        },
        // web mercator
        {
            crsID: 3857,
            basemaps: [
                {
                    id: 'LBL',
                    url:
                        'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/xxxx_TXT_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_xxxx_TXT_3857/default/default028mm/{z}/{y}/{x}.jpg',
                },
                {
                    id: 'CBMT',
                    url:
                        'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg',
                },
            ],
        },
    ];
    private basemapConfig: BasemapConfig = {
        tms: false,
        tileSize: 256,
        attribution: false,
        noWrap: false,
    };

    get basemps(): BasemapOptions[] {
        return this.basemaps;
    }

    // attribution to add the the map
    private attributionVal: Attribution = {
        'en-CA': '© Her Majesty the Queen in Right of Canada, as represented by the Minister of Natural Resources',
        'fr-CA': '© Sa Majesté la Reine du Chef du Canada, représentée par le ministre des Ressources naturelles',
    };
    // build basemap group from both settings and user input
    get Buildbasemapgroup(): BasemapOptions[] {
        // get proper geometry url
        const basemapgroup: BasemapOptions[] = [];
        let mainBasemapOpacity = 1;
        const basemaps: BasemapProps[] = this.basemapsSettings.filter((basemapsSetting) => basemapsSetting.crsID === this.crsID)[0]
            .basemaps;
        if (this.shaded === true) {
            basemapgroup.push({
                id: basemaps.filter((basemap) => basemap.id === 'SHADED')[0].id,
                url: basemaps.filter((basemap) => basemap.id === 'SHADED')[0].url,
                options: this.basemapConfig,
                opacity: 1,
            });
            mainBasemapOpacity = 0.5;
        }
        basemapgroup.push({
            id: basemaps.filter((basemap) => basemap.id === this.basemapID)[0]?.id || 'SIMPLE',
            url:
                basemaps.filter((basemap) => basemap.id === this.basemapID)[0]?.url ||
                basemaps.filter((basemap) => basemap.id === 'SIMPLE')[0].url,
            options: this.basemapConfig,
            opacity: mainBasemapOpacity,
        });

        if (this.labeled === true) {
            // get proper label url
            this.language === 'en-CA'
                ? basemapgroup.push({
                      id: basemaps.filter((basemap) => basemap.id === 'LBL')[0].id,
                      url: basemaps.filter((basemap) => basemap.id === 'LBL')[0].url.replaceAll('xxxx', 'CBMT'),
                      options: this.basemapConfig,
                      opacity: 1,
                  })
                : basemapgroup.push({
                      id: basemaps.filter((basemap) => basemap.id === 'LBL')[0].id,
                      url: basemaps.filter((basemap) => basemap.id === 'LBL')[0].url.replaceAll('xxxx', 'CBCT'),
                      options: this.basemapConfig,
                      opacity: 1,
                  });
        }

        return basemapgroup;
    }
    get attribution(): Attribution {
        return this.attributionVal;
    }
}

interface BasemapConfig {
    tms: boolean;
    tileSize: number;
    attribution: boolean;
    noWrap: boolean;
}
interface BasemapProps {
    id: string;
    url: string;
}
interface BasemapSettings {
    crsID: number;
    basemaps: BasemapProps[];
}

interface BasemapOptions {
    id: string;
    url: string;
    options: BasemapConfig;
    opacity: number;
}

export interface Attribution {
    'en-CA': string;
    'fr-CA': string;
}
