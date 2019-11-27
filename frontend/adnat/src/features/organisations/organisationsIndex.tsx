import React, { useState, useEffect, FunctionComponent } from 'react';
import PageLayout from '../../layout/pageLayout';
import { Button, Typography, Link } from '@material-ui/core';
import Axios, { AxiosResponse } from 'axios';
import Cookies from '../../helpers/Cookies';
import { userDetails } from '../../models/users';
import User from '../users/user';
import { RouteComponentProps, Route, Switch } from 'react-router';
import OrganisationCreateJoin from './organisationsOverview';
import OrganisationsEdit from './organisationsEdit';
import OrganisationsShifts from './organisationsShifts';
import OrganisationsActions from './organisationsActions';

interface loginProps {
    sessionId: string;
}

const OrganistionsIndex: FunctionComponent<RouteComponentProps> = ({children, location, history, match}) => {
    
    const [user, setUser] = useState<userDetails>({
        id: -1,
        organisationId: -1,
        name: "",
        email: ""
    });

    const sessionId = location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId");

    const handleGetUser = async () => {

        let updatedUser: userDetails | undefined;
        
        if (location.state) {
            updatedUser = await User.getUser(location.state.sessionId);
        } else {
            updatedUser = await User.getUser();
        } 
        if (updatedUser !== undefined) {
            setUser(updatedUser);
        }

        
    } 

    const routeToOrganisation = () => {
        /* If the user hasn't joined an organisation get them to create or 
        * join one, otherwise allow them to select actions for that organisation
        */
        if ((user.organisationId === -1) || (user.organisationId === null)) {
            pushRoute({sessionId: sessionId}, 'createjoin')
        } else {
            pushRoute({
                sessionId: sessionId,
                organisationId: user.organisationId
            }, 'actions')
        }
    }

    const pushRoute = (state: object, path: string) => {
        if (location.state) {
            history.push({
                pathname: `/organisation/${path}`,
                state: state
            });
        } else {
            history.push(`/organisation/${path}`);
        }
    }

    useEffect(() => {
        handleGetUser();
    }, []);

    useEffect(() => {
        routeToOrganisation();
    }, [user])

    const handleLogout = async () => {
        const response: AxiosResponse<any> = await Axios.get('http://localhost:3000/auth/logout', {headers: {
            "Authorization": location.state.sessionId ? location.state.sessionId : Cookies.getCookieValue("sessionId"),
            "Content-Type": "application/json"
        }});
        location.state.sessionId = "";
        Cookies.deleteCookie("sessionId");

    };

    return (
        <PageLayout title="Organisations">
            <Button onClick={handleGetUser}>Get User</Button>
            {user ? 
                <>
                    <Typography>You're logged in as {user.name}</Typography>
                    <Link href="/login" onClick={handleLogout}>Logout</Link>
                </> :
                <></>
            }
            <Switch>
                <Route component={OrganisationCreateJoin} path='/organisation/createjoin'/>
                <Route component={OrganisationsActions} path='/organisation/actions'/>
                <Route component={OrganisationsEdit} path='/organisation/edit'/>
                <Route component={OrganisationsShifts} path='/organisation/shifts'/>
            </Switch>
            
        </PageLayout>
    );
};

export default OrganistionsIndex;