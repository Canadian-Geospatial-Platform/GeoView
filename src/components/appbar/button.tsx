/* eslint-disable no-nested-ternary */
import React from 'react';

import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Fade, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { HtmlToReact } from '../../common/containers/html-to-react';

const useStyles = makeStyles((theme) => ({
    listItem: {
        height: '40px',
    },
    listItemColor: {
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

/**
 * Create a button with an icon and text
 * @param {ButtonAppProps} props Button properties
 */
export default function ButtonApp(props: ButtonAppProps): JSX.Element {
    const { id, tooltip, icon, onClickFunction, content } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const Icon = icon.type;

    return (
        <Tooltip title={t(tooltip)} placement="right" TransitionComponent={Fade}>
            <ListItem button id={id} onClick={onClickFunction} className={classes.listItem}>
                <ListItemIcon className={classes.listItemColor}>
                    {typeof icon === 'string' ? <HtmlToReact className={classes.icon} htmlContent={icon} /> : <Icon />}
                </ListItemIcon>
                {typeof content === 'undefined' ? (
                    <ListItemText className={classes.listItemColor} primary={t(tooltip)} />
                ) : typeof content === 'string' ? (
                    <HtmlToReact className={undefined} htmlContent={content} />
                ) : (
                    content
                )}
            </ListItem>
        </Tooltip>
    );
}

interface ButtonAppProps {
    id: string;
    tooltip: string;
    icon: React.ReactNode | Element;
    onClickFunction: () => void;
    // eslint-disable-next-line react/require-default-props
    content?: Element;
}
