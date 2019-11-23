import React from 'react';
import { Typography } from '@material-ui/core';

interface pageLayoutProps {
    title: String;
}


export default function PageLayout<pageLayoutProps> (props: any) {
    const { children, title } = props;

    return (
        <div style={{textAlign: "center"}}>
            <Typography variant="h3">{title}</Typography>
            {children}
        </div>
    );
}