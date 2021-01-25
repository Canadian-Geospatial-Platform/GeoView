import { useCallback, useMemo, useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

import L, { Map, CRS, DomEvent } from 'leaflet';
import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { useEventHandlers } from '@react-leaflet/core';

import { BasemapOptions } from '../../common/basemap';

import { LEAFLET_POSITION_CLASSES } from '../../common/constant';
import api, { EVENT_NAMES } from '../../api/api';

const MINIMAP_SIZE = {
    width: '150px',
    height: '150px',
};

const TOGGLE_BTN_SIZE = {
    width: '31px',
    height: '31px',
};

const useStyles = makeStyles((theme) => ({
    toggleBtn: {
        width: TOGGLE_BTN_SIZE.width,
        height: TOGGLE_BTN_SIZE.height,
        transform: 'scale(1)',
        color: theme.palette.primary.contrastText,
    },
    minimapOpen: {
        transform: 'rotate(-180deg)',
    },
    minimapClosed: {
        transform: 'rotate(0)',
    },
    minimap: {
        width: MINIMAP_SIZE.width,
        height: MINIMAP_SIZE.height,
        '-webkit-transition': '300ms linear',
        '-moz-transition': '300ms linear',
        '-o-transition': '300ms linear',
        '-ms-transition': '300ms linear',
        transition: '300ms linear',
    },
}));

function MinimapToggle(): JSX.Element {
    const divRef = useRef(null);

    const { t } = useTranslation();

    const [status, setStatus] = useState<boolean>(true);

    const minimap = useMap();

    const classes = useStyles();

    /**
     * Toggle overview map to show or hide it
     * @param e the event being triggered on click
     */
    function toggleMinimap(e): void {
        setStatus(!status);

        if (status) {
            // decrease size of overview map to the size of the toggle btn
            minimap.getContainer().style.width = TOGGLE_BTN_SIZE.width;
            minimap.getContainer().style.height = TOGGLE_BTN_SIZE.height;
        } else {
            // restore the size of the overview map
            minimap.getContainer().style.width = MINIMAP_SIZE.width;
            minimap.getContainer().style.height = MINIMAP_SIZE.height;
        }

        // trigger a new event when overview map is toggled
        api.emit(EVENT_NAMES.EVENT_OVERVIEW_MAP_TOGGLE, null, {
            status,
        });
    }

    useEffect(() => {
        L.DomEvent.disableClickPropagation(divRef.current);
    }, []);

    return (
        <div ref={divRef} className={LEAFLET_POSITION_CLASSES.topright}>
            <IconButton
                className={['leaflet-control', classes.toggleBtn, !status ? classes.minimapOpen : classes.minimapClosed].join(' ')}
                style={{
                    margin: 0,
                }}
                aria-label={t('mapctrl.overviewmap.toggle')}
                onClick={toggleMinimap}
            >
                <LaunchIcon />
            </IconButton>
        </div>
    );
}

function MinimapBounds(props: MiniboundProps) {
    const { parentMap, zoomFactor } = props;
    const minimap = useMap();

    // Clicking a point on the minimap sets the parent's map center
    const onClick = useCallback(
        (e) => {
            parentMap.setView(e.latlng, parentMap.getZoom());
        },
        [parentMap]
    );
    useMapEvent('click', onClick);

    // Keep track of bounds in state to trigger renders
    const [bounds, setBounds] = useState({ height: 0, width: 0, top: 0, left: 0 });

    function updateMap(): void {
        // Update the minimap's view to match the parent map's center and zoom
        const newZoom = parentMap.getZoom() - zoomFactor > 0 ? parentMap.getZoom() - zoomFactor : 0;
        minimap.flyTo(parentMap.getCenter(), newZoom);

        // Set in timeout the calculation to create the bound so parentMap getBounds has the updated bounds
        setTimeout(() => {
            minimap.invalidateSize();
            const pMin = minimap.latLngToContainerPoint(parentMap.getBounds().getSouthWest());
            const pMax = minimap.latLngToContainerPoint(parentMap.getBounds().getNorthEast());
            setBounds({ height: pMin.y - pMax.y, width: pMax.x - pMin.x, top: pMax.y, left: pMin.x });
        }, 500);
    }

    useEffect(() => {
        updateMap();

        // listen to API event when the overview map is toggled
        api.on(EVENT_NAMES.EVENT_OVERVIEW_MAP_TOGGLE, (payload) => {
            updateMap();
        });

        // remove the listener when the component unmounts
        return () => {
            api.off(EVENT_NAMES.EVENT_OVERVIEW_MAP_TOGGLE);
        };
    }, []);

    const onChange = useCallback(() => {
        updateMap();
    }, [minimap, parentMap, zoomFactor]);

    // Listen to events on the parent map
    const handlers = useMemo(() => ({ moveend: onChange, zoomend: onChange }), [onChange]);
    useEventHandlers({ instance: parentMap }, handlers);

    return (
        <div
            style={{
                left: `${bounds.left}px`,
                top: `${bounds.top}px`,
                width: `${bounds.width}px`,
                height: `${bounds.height}px`,
                display: 'block',
                opacity: 0.5,
                position: 'absolute',
                border: '1px solid rgb(0, 0, 0)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
            }}
        />
    );
}

export function OverviewMap(props: OverviewProps): JSX.Element {
    const { crs, basemaps, zoomFactor } = props;

    const classes = useStyles();

    const parentMap = useMap();
    const mapZoom = parentMap.getZoom() - zoomFactor > 0 ? parentMap.getZoom() - zoomFactor : 0;

    // Memorize the minimap so it's not affected by position changes
    const minimap = useMemo(
        () => (
            <MapContainer
                className={classes.minimap}
                center={parentMap.getCenter()}
                zoom={mapZoom}
                crs={crs}
                dragging={false}
                doubleClickZoom={false}
                scrollWheelZoom={false}
                attributionControl={false}
                zoomControl={false}
                whenCreated={(cgpMap) => {
                    DomEvent.disableClickPropagation(cgpMap.getContainer());
                    DomEvent.disableScrollPropagation(cgpMap.getContainer());
                }}
            >
                {basemaps.map((base: { id: string | number | null | undefined; url: string }) => (
                    <TileLayer key={base.id} url={base.url} />
                ))}
                <MinimapBounds parentMap={parentMap} zoomFactor={zoomFactor} />
                <MinimapToggle parentMap={parentMap} />
            </MapContainer>
        ),
        [parentMap, crs, mapZoom, basemaps, zoomFactor]
    );

    return (
        <div className={LEAFLET_POSITION_CLASSES.topright}>
            <div className="leaflet-control leaflet-bar">{minimap}</div>
        </div>
    );
}

interface OverviewProps {
    crs: CRS;
    basemaps: BasemapOptions[];
    zoomFactor: number;
}

interface MiniboundProps {
    parentMap: Map;
    zoomFactor: number;
}
