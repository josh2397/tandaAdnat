import React, { FunctionComponent, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import MaterialTable from 'material-table';
import { organisationListDTO } from '../../models/organisations';
import { Typography, Container, Button, TextField, FormControl } from '@material-ui/core';
import Cookies from '../../helpers/Cookies';
import Axios, { AxiosResponse } from 'axios';
import produce from 'immer';
import AuthContext, { defaultUserDetails } from '../../components/authContext';
import { useEffect } from 'react';

const OrganisationCreateJoin: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const authAPI = useContext(AuthContext);
    const updateUserDetails = authAPI.updateUserDetails ? authAPI.updateUserDetails : () => { console.log("updateUserDetails is undefined")};
    const [organisationList, setOrganisationList] = useState([] as organisationListDTO[]);
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;

    const [sessionId, setSessionId] = useState(location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId"));    
    const [newOrgDetails, setNewOrgDetails] = useState({
        name: "",
        hourlyRate: ""
    });

    useEffect(() => {
        getOrganisationList();
    }, [])

    const getOrganisationList = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.get('http://localhost:3000/organisations', {headers: {
                "Authorization" : sessionId,
                "Content-Type": "application/json"
            }});

            console.log(response);

            if (response.status === 200) {
                console.log(response.data);
                setOrganisationList(response.data);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const updateUserDetailsFromResponse = (response: AxiosResponse<any>) => {
        const {organisationName, organisationId, ...details} = userDetails;
        const updatedUserDetails = {organisationName: response.data.name, organisationId: response.data.id, ...details};
        
        updateUserDetails(updatedUserDetails);
    }

    const joinOrganisation = async (id: number) => {
        console.log("joining org");
        try {
            console.log("joining org - in try");
            const response: AxiosResponse<any> = await Axios.post(
                'http://localhost:3000/organisations/join',
                {
                    "organisationId": id
                },
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});

            if (response.status === 200) {

                updateUserDetailsFromResponse(response);

                history.push({
                    pathname: "organisation/actions",
                    state: {
                        sessionId: sessionId,
                        organisationId: id
                    }
                })

            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const createAndJoinOrganisation = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.post(
                'http://localhost:3000/organisations/create_join',
                {
                    "name": newOrgDetails.name,
                    "hourlyRate": +newOrgDetails.hourlyRate
                },
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});
            
            if (response.status === 200) {

                updateUserDetailsFromResponse(response);
                getOrganisationList();
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const updateNewOrgDetails = (property: string, value: any) => {
        const updatedNewOrgDetails = produce(newOrgDetails, draftNewOrgDetails => {
            switch (property) {
                case "name":
                    draftNewOrgDetails.name = value;
                    break;
                case "hourlyRate":
                    draftNewOrgDetails.hourlyRate = value;
                    break;
            }
        });
        setNewOrgDetails(updatedNewOrgDetails);
    }

    return (
        <Container maxWidth="sm" style={{marginTop: "40px", borderStyle: "solid", borderRadius: "10px", borderColor: "#969696"}}>
            <Typography variant='body2'>
                You aren't a member of any organisations.<br/>
                Join an existing one or create a new one.
            </Typography>

            <Button onClick={getOrganisationList} >Get Organisations</Button>

            <MaterialTable
                columns={[
                    {title: "Name", field: "name", type: "string"},
                    {title: "Hourly Rate", field: "hourlyRate", type: "numeric"}
                ]}
                data={organisationList}
                title="Existing Organisations"
                options={{search: false}}
                actions={[
                    {
                        icon: 'save',
                        tooltip: 'Join Organisation',
                        onClick: (event: any, rowData: any) => {
                            console.log(rowData.id);
                            joinOrganisation(rowData.id);
                        }
                    }
                ]}
            />

            <Typography style={{marginTop: 80}}>
                Create Organisation
            </Typography>

            <FormControl>
                <TextField
                    style={{marginTop: 20}}
                    label="Name"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                        updateNewOrgDetails("name", event.target.value)}
                    value={newOrgDetails.name}

                />
                <TextField
                    style={{marginTop: 20}}
                    label="Hourly Rate"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateNewOrgDetails("hourlyRate", event.target.value)}
                    value={newOrgDetails.hourlyRate}
                />

                <Button onClick={createAndJoinOrganisation} >Create and Join</Button>
            </FormControl>

        </Container>
    );
};

export default OrganisationCreateJoin;