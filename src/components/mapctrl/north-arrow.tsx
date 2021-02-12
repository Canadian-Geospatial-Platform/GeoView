import { useCallback, useRef } from 'react';

import L, { Map } from 'leaflet';

import { useMapEvent } from 'react-leaflet';
import { makeStyles } from '@material-ui/core/styles';
import { api } from '../../api/api';
import { PROJECTION_NAMES } from '../../api/projection';

const useStyles = makeStyles((theme) => ({
    northArrowContainer: {
        left: '50%',
    },
    northArrow: {
        width: 42,
        height: 42,
    },
}));

interface NorthArrowProps {
    projection: L.CRS;
}

export function NorthArrow(props: NorthArrowProps): JSX.Element {
    const { projection } = props;

    const classes = useStyles();

    const northArrowRef = useRef();

    const getNorthArrowAngle = (point: L.Point | null, map: Map): string => {
        const { min, max } = map.getPixelBounds();

        // get center point in longitude and use bottom value for latitude for default point
        const bottomCenter: L.Point = L.point((min.x + max.x) / 2, min.y);

        // get point if specified by caller else get default
        const p = point ? point || bottomCenter : bottomCenter;
        try {
            const b: number[] = api.projection.lccToLatLng([p.x, p.y])[0];

            const pointB = L.point(b[0], b[1]);

            // north value (set longitude to be half of Canada extent (141° W, 52° W))
            const pointA = { x: -96, y: 90 };

            // set info on longitude and latitude
            const dLon = ((pointB.x - pointA.x) * Math.PI) / 180;
            const lat1 = (pointA.y * Math.PI) / 180;
            const lat2 = (pointB.y * Math.PI) / 180;

            // calculate bearing
            const y = Math.sin(dLon) * Math.cos(lat2);
            const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            const bearing = (Math.atan2(y, x) * 180) / Math.PI;

            // return angle (180 is pointiong north)
            return ((bearing + 360) % 360).toFixed(1);
        } catch (error) {
            return '180.0';
        }
    };

    const onMouseMove = useCallback((e) => {
        const map = e.target as Map;

        if (projection.code === PROJECTION_NAMES.LCC) {
            const offsetX = northArrowRef.current.offsetLeft;

            const arrowPoint: number[] = api.projection.latLngToLCC([offsetX, 0])[0];
            arrowPoint[1] = map.getPixelBounds().min.y;

            const angleDegrees = 270 - parseFloat(getNorthArrowAngle(L.point(arrowPoint[0], arrowPoint[1]), e.target as Map));

            const rotationAngle = 90 - angleDegrees;
            const northPoint = api.projection.lccToLatLng([-96, 90])[0];
        }
    }, []);

    useMapEvent('move', onMouseMove);

    const northArrow = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            focusable="false"
            className={classes.northArrow}
        >
            <g id="northarrow" transform="translate(-285.24 -142.234)">
                <path
                    id="path3770-7"
                    d="M305.91 156.648a8.652 8.652 0 0 1-8.654 8.653 8.652 8.652 0 0 1-8.653-8.653 8.653 8.653 0 0 1 8.653-8.653 8.653 8.653 0 0 1 8.653 8.653z"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth=".895"
                />
                <path
                    id="path3770"
                    d="M304.982 156.648a7.725 7.725 0 0 1-7.726 7.726 7.725 7.725 0 0 1-7.726-7.726 7.725 7.725 0 0 1 7.726-7.726 7.725 7.725 0 0 1 7.726 7.726z"
                    fill="none"
                    stroke="#6d6d6d"
                    strokeWidth=".799"
                />
                <path id="path3774" d="M297.256 156.648v-8.525" fill="none" stroke="#000" strokeWidth=".067" />
                <path
                    d="M297.258 143.48l8.793 22.432-8.811-8.812-8.812 8.812z"
                    id="path3778"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth=".912"
                />
                <path
                    d="M297.256 144.805l7.726 19.568-7.726-7.726-7.726 7.726z"
                    id="path3780"
                    fill="#d6d6d6"
                    stroke="#000"
                    strokeWidth=".266"
                    strokeLinecap="square"
                />
                <path
                    id="path6038"
                    d="M297.256 144.666l-7.726 19.568 7.726-7.726"
                    fill="#6d6d6d"
                    strokeWidth=".296"
                    strokeLinecap="square"
                />
            </g>
        </svg>
    );

    return (
        <div ref={northArrowRef} className={`leaflet-control leaflet-top leaflet-left ${classes.northArrowContainer}`}>
            {northArrow}
        </div>
    );
}
