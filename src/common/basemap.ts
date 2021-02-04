/**
 * A class to get a basemap for a define projection. For the moment, we a  Web Mercator and a LCC basemap.
 * We intend to have only one basemap per projection to avoid the need of a basemap switcher.
 * If we add a new projection, we need to also add a basemap.
 *
 * @export
 * @class Basemap
 */
export class Basemap {
    private language = '';
    private basemapID='';
    private shaded: boolean;
    private labeled: boolean;

    constructor(language: string , basemapID:string , shaded:boolean , labeled:boolean) {
        this.language = language;
        this.basemapID=basemapID;
        this.shaded= shaded;
        this.labeled= labeled;
    };

    private lccShadedUrls:Basemapurl[] =   [      
        { 'id': '3978-SHADED', 'url': 'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBME_CBCE_HS_RO_3978/MapServer/WMTS/tile/1.0.0/CBMT_CBCT_GEOM_3978/default/default028mm/{z}/{y}/{x}.jpg'}   
    ];
    private lccLabelUrls:Basemapurl[] =   [      
        { 'id': '3978-LBL', 'url': 'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/xxxx_TXT_3978/MapServer/WMTS/tile/1.0.0/xxxx_TXT_3978/default/default028mm/{z}/{y}/{x}.jpg'}   
    ];
    // LCC url arrays {'ID', 'WMTS Geometry URL', 'WMTS Label URL'}
    private lccUrls:Basemapurl[] =   [        
        { 'id': '3978-SHADED', 'url': 'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBME_CBCE_HS_RO_3978/MapServer/WMTS/tile/1.0.0/CBMT_CBCT_GEOM_3978/default/default028mm/{z}/{y}/{x}.jpg'},
        { 'id': '3978-CBMT', 'url': 'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3978/MapServer/WMTS/tile/1.0.0/CBMT_CBCT_GEOM_3978/default/default028mm/{z}/{y}/{x}.jpg' },
        { 'id': '3978-SIMPLE', 'url': 'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/Simple/MapServer/WMTS/tile/1.0.0/Simple/default/default028mm/{z}/{y}/{x}.jpg'}
    ];

    // Web Mercator url arrays {'ID', 'WMTS Geometry URL', 'WMTS Label URL'}
    private wbUrls: Basemapurl[] = [       
        { 'id': '3857-CBMT', 'url':  'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg' }
    ];
    // Web Mercator url arrays {'ID', 'WMTS Geometry URL', 'WMTS Label URL'}
    private wbLabelUrls: Basemapurl[] = [      
        { 'id': '3857-LBL', 'url':  'https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/xxxx_TXT_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_xxxx_TXT_3857/default/default028mm/{z}/{y}/{x}.jpg' }
    ];                        
    // Web Mercator url arrays {'ID', 'WMTS Geometry URL', 'WMTS Label URL'}
    private wbShadedUrls: Basemapurl[] = [      
        { 'id': '3857-SHADED', 'url':''}
    ];
     

    private basemapConfig: BasemapConfig = {
        tms: false,
        tileSize: 256,
        attribution: false,
        noWrap: false,
    };

    // LCC basemap options
    private lccParamCBMT: BasemapOptions[] = [
        {
            id: 'lccShaded',
            url: '',//this.lccUrls[0].url , //default value
            options: this.basemapConfig,
            opacity:1,
        },
        {
            id: 'lccGeom',
            url: '',//default value
            options: this.basemapConfig,
            opacity:1,
        },
        {
            id: 'lccLabel',
            url: '', //default value
            options: this.basemapConfig,
            opacity:1,
        },
    ];


    // Web Mercator basemap options
    private wmParamCBMT: BasemapOptions[] = [
        {
            id: 'wmShaded',
            url: '', // this.wbUrls[0].url, //default value
            options: this.basemapConfig,
            opacity:1,
        },
        {
            id: 'wmGeom',
            url:  '', //default value
            options: this.basemapConfig,
            opacity:1,
        },
        {
            id: 'wmLabel',
            url:'', //default value
            options: this.basemapConfig,
            opacity:1,
        },
    ];

    // attribution to add the the map
    private attributionVal: Attribution = {
        'en-CA': '© Her Majesty the Queen in Right of Canada, as represented by the Minister of Natural Resources',
        'fr-CA': '© Sa Majesté la Reine du Chef du Canada, représentée par le ministre des Ressources naturelles',
    };

    get lccCBMT(): BasemapOptions[] {
        
        // get proper geometry url
        this.lccParamCBMT[1].url =this.lccUrls.filter(lccurl => lccurl.id ===this.basemapID)[0].url ;
        if (this.shaded===true){
           // this.lccParamCBMT[1].url =this.lccUrls.filter(lccurl => lccurl.id ===this.basemapID)[0].url ;
            this.lccParamCBMT[0].url =this.lccShadedUrls[0].url        
            this.lccParamCBMT[1].opacity=0.5;
        }
        else{
            
        }
        
        if (this.labeled===true){
            // get proper label url
            this.lccParamCBMT[2].url =
                this.language === 'en-CA'
                    ? this.lccParamCBMT[2].url=this.lccLabelUrls[0].url.replaceAll('xxxx', 'CBMT')
                    : this.lccParamCBMT[2].url=this.lccLabelUrls[0].url.replaceAll('xxxx', 'CBCT')
         
        }            
        return this.lccParamCBMT;
    }

    get wmCBMT(): BasemapOptions[] {
        // get proper geometry url
        this.wmParamCBMT[1].url =this.wbUrls.filter(wbUrl => wbUrl.id ===this.basemapID)[0].url ;
        if (this.shaded===true){
            this.wmParamCBMT[0].url =this.wbShadedUrls[0].url        
            this.wmParamCBMT[1].opacity=0.5;
            }
        // get proper label url
        if (this.labeled===true){
            this.wmParamCBMT[2].url =
                this.language === 'en-CA'
                    ? this.wmParamCBMT[2].url=this.wbLabelUrls[0].url.replaceAll('xxxx', 'CBMT')
                    : this.wmParamCBMT[2].url=this.wbLabelUrls[0].url.replaceAll('xxxx', 'CBCT');        
        }       
        return this.wmParamCBMT;
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
interface Basemapurl {
    id: string;
    url: string;

    
}

export interface BasemapOptions {
    id: string;
    url: string;
    options: BasemapConfig;
    opacity:number;
}

export interface Attribution {
    'en-CA': string;
    'fr-CA': string;
}
