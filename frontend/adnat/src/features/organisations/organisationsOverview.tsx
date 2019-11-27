import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { userDetails } from '../../models/users';

import User from '../users/user';
import { Typography, Paper, Box, Container } from '@material-ui/core';
import Cookies from '../../helpers/Cookies';

const OrganisationCreateJoin: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const sessionId = location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId");

    return (
        <Container maxWidth="sm" style={{marginTop: "40px", borderStyle: "solid", borderRadius: "10px", borderColor: "#969696"}}>
            <Typography variant='body2'>
                You aren't a member of any organisations.<br/>
                Join an existing one or create a new one.
            </Typography>

            <Typography variant="h6">
                Existing Organisations
            </Typography>
        </Container>
    );
};

export default OrganisationCreateJoin;