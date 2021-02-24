import { useRef, useEffect } from 'react';

import { DomEvent } from 'leaflet';

import { useTranslation } from 'react-i18next';

import { Tooltip, Fade, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { HtmlToReact } from '../../common/containers/html-to-react';

const useStyles = makeStyles((theme) => ({
    buttonClass: {
        margin: theme.spacing(2, 0),
    },
    color: {
        backgroundColor: 'rgba(255,255,255,1)',
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.dark,
        },
    },
    icon: {
        width: '1em',
        height: '1em',
        display: 'inherit',
        fontSize: '1.7142857142857142rem',
        alignItems: 'inherit',
        justifyContent: 'inherit',
        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        flexShrink: 0,
        userSelect: 'none',
    },
}));

interface ButtonMapNavProps {
    tooltip: string;
    icon: React.ReactNode;
    onClickFunction: () => void;
}

export function ButtonMapNav(props: ButtonMapNavProps): JSX.Element {
    const { tooltip, icon, onClickFunction } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const newButton = useRef();

    useEffect(() => {
        // disable events on container
        DomEvent.disableClickPropagation(newButton.current.children[0] as HTMLElement);
        DomEvent.disableScrollPropagation(newButton.current.children[0] as HTMLElement);
    }, []);

    return (
        <Tooltip title={t(tooltip)} placement="left" TransitionComponent={Fade} ref={newButton}>
            <Button className={`${classes.buttonClass} ${classes.color}`} onClick={onClickFunction}>
                {typeof icon === 'string' ? <HtmlToReact className={classes.icon} htmlContent={icon} /> : icon}
            </Button>
        </Tooltip>
    );
}
