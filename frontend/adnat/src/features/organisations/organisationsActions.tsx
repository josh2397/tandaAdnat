import React, { FunctionComponent, useState, useContext } from 'react';
import { Typography, Button, Container, Card, CardContent, CardActions, Divider } from '@material-ui/core';
import { RouteComponentProps, Switch, Route } from 'react-router';
import Axios, { AxiosResponse } from 'axios';
import Cookies from '../../helpers/Cookies';
import { useEffect } from 'react';
import AuthContext, { defaultUserDetails } from '../../components/authContext';
import OrganisationsShifts from './organisationsShifts';
import OrganisationsEdit from './organisationsEdit';

const OrganisationsActions: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const authAPI = useContext(AuthContext);
    const updateUserDetails = authAPI.updateUserDetails ? authAPI.updateUserDetails : () => { console.log("updateUserDetails is undefined")};
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;
    const [sessionId, setSessionId] = useState(location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId"));    

    const handleGetOrganisation = async () => {
        console.log("SessionId in get org:", sessionId);
        try {
            const response: AxiosResponse<any> = await Axios.get(
                `http://localhost:3000/organisations/${userDetails.organisationId}`,
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});

            console.log(response);
            if (response.status === 200) {
                const {organisationName, ...details} = userDetails;
                const updatedUserDetails = { organisationName: response.data.name, ...details};
                updateUserDetails(updatedUserDetails);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleViewShiftsClick = () => {
        history.push({
            pathname: '/organisation/actions/shifts',
            state: {
                sessionId: sessionId
            }
        });
    }
    
    const handleEditClick = () => {
        history.push({
            pathname: '/organisation/actions/edit',
            state: {
                sessionId: sessionId
            }
        })
    }
    

    useEffect(() => {
        console.log("organisationId from actions:", userDetails.organisationId, location.state);

        handleGetOrganisation();
    }, [])

    useEffect(() => {
        console.log("userOrgDetails updated: ", userDetails);
    },[userDetails])

    return (
        <>
            <Card style={{margin: "80px auto 0 auto", width: "80%"}}>
                <CardContent>
                    <Typography variant='h5'>
                        {userDetails.organisationName}
                    </Typography>
                </CardContent>
                
                <CardContent>
                    <Button color="secondary" onClick={handleViewShiftsClick}>View Shifts</Button>
                    <Button color="secondary" onClick={handleEditClick}>Edit</Button>
                    <Button color="secondary" onClick={handleGetOrganisation}>Refresh</Button>
                </CardContent>

                <CardActions>
                    <Switch>
                        <Route exact={true} component={OrganisationsShifts} path='/organisation/actions/shifts'/>
                        <Route exact={true} component={OrganisationsEdit} path='/organisation/actions/edit'/>
                    </Switch>
                </CardActions>
            </Card>

            
        </>
    );
};

export default OrganisationsActions;