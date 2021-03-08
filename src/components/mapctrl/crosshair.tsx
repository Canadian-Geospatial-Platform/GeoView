/* eslint-disable react/no-danger */
import { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useMap } from 'react-leaflet';

import { api } from '../../api/api';
import { EVENT_NAMES } from '../../api/event';
import { CrosshairIcon } from '../../assests/style/crosshair';
import { MapInterface } from '../../common/map-viewer';

const useStyles = makeStyles((theme) => ({
    crosshairContainer: {
        position: 'absolute',
        top: theme.spacing(0),
        right: theme.spacing(0),
        left: theme.spacing(0),
        bottom: theme.spacing(0),
        paddingBottom: theme.spacing(6),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        'pointer-events': 'none !important',
        zIndex: theme.zIndex.leafletControl,
    },
    crosshairInfo: {
        position: 'absolute',
        top: theme.spacing(0),
        right: theme.spacing(0),
        left: theme.spacing(0),
        height: 'calc(1em + 8px)',
        padding: theme.spacing(2, 1, 4, 1),
        backgroundColor: 'rgba(228, 227, 227, 0.9)',
        '& span': {
            paddingLeft: 70,
        },
    },
    crosshairIcon: {
        width: theme.overrides?.crosshair.width,
        height: theme.overrides?.crosshair.width,
    },
}));

/**
 * Crosshair properties interface
 */
interface CrosshairBProps {
    id: string;
}

/**
 * Create a Crosshair when map is focus with the keyboard so user can click on the map
 * @param {CrosshairBProps} props the snackbar properties
 * @return {JSX.Element} the north arrow component
 */
export function Crosshair(props: CrosshairBProps): JSX.Element {
    const { id } = props;

    const classes = useStyles();
    const { t } = useTranslation();

    const map = useMap();

    const mapId = (api.mapInstance(map) as MapInterface).id;

    const mapContainer = map.getContainer();

    // tracks if the last action was done through a keyboard (map navigation) or mouse (mouse movement)
    const [isCrosshairsActive, setCrosshairsActive] = useState(false);
    const [panelButtonId, setPanelButtonId] = useState<string>();

    /**
     * Siimulate map mouse click to trigger details panel
     * @param {KeyboardEvent} evt the keyboard event
     */
    const simulateClick = useCallback(
        (evt: KeyboardEvent): void => {
            if (evt.key === 'Enter') {
                const latlngPoint = map.getCenter();

                if (isCrosshairsActive) {
                    const { panel } = api.map(mapId).appBarPanels.default[panelButtonId];

                    if (!panel.status) {
                        // emit an event with the latlng point
                        api.event.emit(EVENT_NAMES.EVENT_DETAILS_PANEL_CROSSHAIR_ENTER, mapId, {
                            latlng: latlngPoint,
                        });
                    }
                }
            }
        },
        [isCrosshairsActive, map, mapId, panelButtonId]
    );

    useEffect(() => {
        mapContainer.addEventListener('keydown', simulateClick);

        // on map keyboard focus, add crosshair
        api.event.on(EVENT_NAMES.EVENT_MAP_IN_KEYFOCUS, (payload) => {
            if (payload && payload.handlerName.includes(id)) {
                setCrosshairsActive(true);
            }
        });

        // listen to enable / disable crosshair events
        api.event.on(EVENT_NAMES.EVENT_MAP_CROSSHAIR_ENABLE_DISABLE, (payload) => {
            if (payload && payload.handlerName.includes(id)) {
                setCrosshairsActive((prevStatus) => !prevStatus);

                setPanelButtonId(payload.buttonId);
            }
        });

        return () => {
            api.event.off(EVENT_NAMES.EVENT_MAP_IN_KEYFOCUS);
            api.event.off(EVENT_NAMES.EVENT_MAP_CROSSHAIR_ENABLE_DISABLE);
            mapContainer.removeEventListener('keydown', simulateClick);
        };
    }, [setPanelButtonId, isCrosshairsActive, simulateClick, mapContainer, id]);

    return (
        <div
            className={classes.crosshairContainer}
            style={{
                visibility: isCrosshairsActive ? 'visible' : 'hidden',
            }}
        >
            <Fade in={isCrosshairsActive}>
                <div className={classes.crosshairIcon}>
                    <CrosshairIcon />
                </div>
            </Fade>
            <div className={classes.crosshairInfo}>
                <span dangerouslySetInnerHTML={{ __html: t('mapctrl.crosshair') }} />
            </div>
        </div>
    );
}
