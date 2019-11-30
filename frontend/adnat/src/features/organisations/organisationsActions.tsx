import React, { FunctionComponent, useState, useContext } from 'react';
import { Typography, Button } from '@material-ui/core';
import { RouteComponentProps, Switch, Route } from 'react-router';
import Axios, { AxiosResponse } from 'axios';
import Cookies from '../../helpers/Cookies';
import { useEffect } from 'react';
import AuthContext, { defaultUserDetails } from '../../components/authContext';
import OrganisationsShifts from './organisationsShifts';

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
        history.push('/organisation/actions/shifts');
    }
    
    

    useEffect(() => {
        console.log("in actions");
        console.log("organisationId from actions:", userDetails.organisationId, location.state);

        handleGetOrganisation();
    }, [])

    useEffect(() => {
        console.log("userOrgDetails updated: ", userDetails);
    },[userDetails])

    return (
        <>
        <Typography style={{marginTop: 80}} variant='h5'>
            {userDetails.organisationName}
        </Typography>


        <Button color="primary" onClick={handleViewShiftsClick}>View Shifts</Button>
        <Button>Edit</Button>
        <Button onClick={handleGetOrganisation}>Get Organisation</Button>

        <Switch>

            <Route component={OrganisationsShifts} path='/organisation/actions/shifts'/>
        </Switch>
        </>
    );
};

export default OrganisationsActions;