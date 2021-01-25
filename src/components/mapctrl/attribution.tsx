import React, { useEffect, useRef } from 'react';

import L from 'leaflet';

import { makeStyles } from '@material-ui/core/styles';

import { LEAFLET_POSITION_CLASSES } from '../../common/constant';

const useStyles = makeStyles((theme) => ({
    attributionContainer: {
        marginLeft: '65px',
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(0, 4),
    },
    attributionText: {
        margin: '0 !important',
        padding: theme.spacing(2),
        fontSize: theme.typography.subtitle2.fontSize,
    },
}));

type AttributionProps = {
    attribution: string;
};

function Attribution(props: AttributionProps): JSX.Element {
    const { attribution } = props;

    const classes = useStyles();

    const divRef = useRef(null);

    useEffect(() => {
        L.DomEvent.disableClickPropagation(divRef.current);
    }, []);

    return (
        <div ref={divRef} className={[classes.attributionContainer, LEAFLET_POSITION_CLASSES.bottomleft].join(' ')}>
            <span className={['leaflet-control', classes.attributionText].join(' ')}>{attribution}</span>
        </div>
    );
}

export default Attribution;
