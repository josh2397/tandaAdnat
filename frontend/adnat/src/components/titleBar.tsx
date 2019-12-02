import React, { useContext, FunctionComponent, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, Menu, MenuItem, IconButton, Link } from '@material-ui/core';
import AuthContext from './authContext';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { RouteComponentProps } from 'react-router';
import Cookies from '../helpers/Cookies';
import Axios, { AxiosResponse } from 'axios';

export default function TitleBar() {

    const authAPI = useContext(AuthContext);
    const updateAuthentication = authAPI.updateAuthentication ? authAPI.updateAuthentication : () => {console.log("toggleAuthenticated is undefined")};
    const authenticated = authAPI.authenticated ? authAPI.authenticated : undefined;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" style={{marginBottom: "5%"}}>
            <Toolbar>
                <Typography variant="h5" style={{color: "white"}}>
                    ADNAT
                </Typography>

                {
                    authenticated ?
                    (
                        <>
                            <IconButton size="medium" onClick={handleClick} style={{marginLeft: "auto"}}>
                                <AccountCircleIcon/>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem></MenuItem>
                            </Menu> 
                        </>
                    )
                    : (
                        <></>
                    )
                }
            </Toolbar>
        </AppBar>
    );
};