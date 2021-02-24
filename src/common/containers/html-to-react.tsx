/* eslint-disable react/no-danger */
import React from 'react';

interface HtmlToReactProps {
    htmlContent: string;
    className: string | undefined;
}

export const HtmlToReact = (props: HtmlToReactProps): JSX.Element => {
    const { htmlContent, className } = props;

    return <div className={className} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};
