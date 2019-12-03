import React, { useState, useEffect, FunctionComponent, useContext } from 'react';
import PageLayout from '../../layout/pageLayout';
import { Typography, Link } from '@material-ui/core';
import Axios, { AxiosResponse } from 'axios';
import Cookies from '../../helpers/Cookies';
import { userDetails } from '../../models/users';
import AuthContext, {defaultUserDetails} from '../../components/authContext';
import User from '../users/user';
import { RouteComponentProps, Route, Switch, Redirect } from 'react-router';
import OrganisationCreateJoin from './organisationsOverview';
import OrganisationsEdit from './organisationsEdit';
import OrganisationsShifts from './organisationsShifts';
import OrganisationsActions from './organisationsActions';



const OrganistionsIndex: FunctionComponent<RouteComponentProps> = ({children, location, history, match}) => {

    const authAPI = useContext(AuthContext);
    const updateAuthentication = authAPI.updateAuthentication ? authAPI.updateAuthentication : () => {console.log("toggleAuthenticated is undefined")};
    const updateUserDetails = authAPI.updateUserDetails ? authAPI.updateUserDetails : () => { console.log("updateUserDetails is undefined")};
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;

    const [sessionId, setSessionId] = useState(location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId"));
    
    const [user, setUser] = useState<userDetails>({
        id: -1,
        organisationId: -1,
        name: "",
        email: ""
    });

    const handleGetUser = async () => {

        let updatedUser: userDetails | undefined;
        try {
            if (location.state) {
                updatedUser = await User.getUser(location.state.sessionId);
            } else {
                updatedUser = await User.getUser();
            } 
            if (updatedUser !== undefined) {
                setUser(updatedUser);
                updateUserDetails({
                    organisationId: updatedUser.organisationId, 
                    name: updatedUser.name,
                    id: updatedUser.id,
                    organisationName: userDetails.organisationName
                });
            }
        } catch (ex) {
            console.log(ex)
        }
    } 

    const routeToOrganisation = () => {
        /* If the user hasn't joined an organisation get them to create or 
        * join one, otherwise allow them to select actions for that organisation
        */
        if ((userDetails.organisationId === undefined) || (userDetails.organisationId === -1) || (userDetails.organisationId === null)) {
            pushRoute({sessionId: sessionId}, 'createjoin')
        } else {
            pushRoute({
                sessionId: sessionId,
                organisationId: user.organisationId
            }, 'actions')
        }
    }

    const pushRoute = (state: object, path: string) => {
        if (sessionId) {
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
        if ((userDetails.organisationId !== undefined) && (userDetails.organisationId !== -1)) {
            routeToOrganisation();
        }
        
    }, [authAPI.userDetails])

    const handleLogout = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.delete('http://localhost:3000/auth/logout', {headers: {
                "Authorization": location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId"),
                "Content-Type": "application/json"
            }});
            if (response.status === 200) {
                if (location.state) {
                    location.state.sessionId = ""; 
                }
                Cookies.deleteCookie("sessionId");
                setUser({
                    id: -1,
                    organisationId: -1,
                    name: "",
                    email: ""
                })
                updateAuthentication(false);
    
            }
        } catch (ex) {
            console.log(ex);
        }

    };

    return (
        <PageLayout title="Organisations">
            {user ? 
                <>
                    <Typography style={{marginTop: 20}}>
                        You're logged in as {user.name}
                    </Typography>
                    <Link href="/login" onClick={handleLogout}>Logout</Link><br/>
                    <Link href='/changepassword' variant='body2'>Change Password?</Link>
                </> :
                <></>
            }
            <Switch>
                <Route exact={true} component={OrganisationCreateJoin} path='/organisation/createjoin'/>
                <Route component={OrganisationsActions} path='/organisation/actions'/>
                <Route exact={true} component={OrganisationsEdit} path='/organisation/edit'/>
                <Route exact={true} component={OrganisationsShifts} path='/organisation/shifts'/>
                <Route render={() => <Redirect to={{pathname: "/organisation"}} />} />
            </Switch>
            
        </PageLayout>
    );
};

export default OrganistionsIndex;