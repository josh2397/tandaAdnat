import React, { FunctionComponent, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import MaterialTable from 'material-table';
import { organisationListDTO, createOrganisationDTO } from '../../models/organisations';
import { 
    Typography, 
    Container, 
    Button, 
    TextField, 
    FormControl, 
    Divider, 
    Card, 
    CardContent, 
    CardActions 
} from '@material-ui/core';
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
    const [newOrgDetails, setNewOrgDetails] = useState<createOrganisationDTO>({
        name: "",
        rate: ""
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

            if (response.status === 200) {
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
        try {
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
                    "hourlyRate": +newOrgDetails.rate
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
                    draftNewOrgDetails.rate = value;
                    break;
            }
        });
        setNewOrgDetails(updatedNewOrgDetails);
    }

    return (
        <Container maxWidth="sm" style={{marginTop: "40px", marginBottom: "40px", borderStyle: "solid", borderRadius: "10px", borderColor: "grey"}}>
            <Typography style={{margin: "40px 0 40px 0"}}variant='body2'>
                You aren't a member of any organisations.<br/>
                Join an existing one or create a new one.
            </Typography>

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
                        icon: 'group_add',
                        tooltip: 'Join Organisation',
                        onClick: (event: any, rowData: any) => {
                            console.log(rowData.id);
                            joinOrganisation(rowData.id);
                        }
                    }
                ]}
            />
            <Divider style={{margin: "40px 0 40px 0"}}/>

            
            <Card style={{marginBottom: 40}}>
                <CardContent>
                    <Typography variant="h6">
                        Create Organisation
                    </Typography>
                    <FormControl>
                        <TextField
                            style={{marginTop: 20}}
                            label="Name"
                            color="secondary"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                                updateNewOrgDetails("name", event.target.value)}
                            value={newOrgDetails.name}

                        />
                        <TextField
                            style={{marginTop: 20}}
                            label="Hourly Rate"
                            color="secondary"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                updateNewOrgDetails("hourlyRate", event.target.value)}
                            value={newOrgDetails.rate}
                        />
                    </FormControl>

                </CardContent>
                <CardActions >
                    <Button color="secondary" onClick={createAndJoinOrganisation} >Create and Join</Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default OrganisationCreateJoin;