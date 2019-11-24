import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';

export default function TitleBar () {
    return (
        <AppBar position="static" style={{marginBottom: "5%"}}>
            <Toolbar>
                <Typography variant="h5" style={{color: "white"}}>
                    ADNAT
                </Typography>
            </Toolbar>
        </AppBar>
    );
};