import React, { useState, useContext, useEffect, FunctionComponent } from 'react';
import { FormControl, TextField, Typography, Button, Container } from '@material-ui/core';
import { editOrganisationDTO } from '../../models/organisations';
import produce from 'immer';
import AuthContext, { defaultUserDetails } from '../../components/authContext';
import Axios, { AxiosResponse } from 'axios';
import Validation from '../../global/validation';
import { RouteComponentProps } from 'react-router';
import Cookies from '../../helpers/Cookies';

const OrganisationsEdit: FunctionComponent<RouteComponentProps> = ({location}) => {

    const authAPI = useContext(AuthContext);
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;
    const updateUserDetails = authAPI.updateUserDetails ? authAPI.updateUserDetails : () => { console.log("updateUserDetails is undefined")};

    const [sessionId, setSessionId] = useState(location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId"));    

    const [orgHourlyRate, setOrgHourlyRate] = useState<number>(-1);

    const [organisation, setOrganisation] = useState<editOrganisationDTO>({
        id: "",
        name: "",
        hourlyRate: ""
    })

    const [helperText, setHelperText] = useState({
        name: "",
        hourlyRate: ""
    });

    const [inputErrorFlags, setInputErrorFlags] = useState({
        name: false,
        hourlyRate: false
    });

    useEffect(() => {
        updateOrganisation("id", userDetails.organisationId.toString());
        updateOrganisation("name", userDetails.organisationName);
        getOrganisationPayRate();
    }, [])

    useEffect(() => {
        if (orgHourlyRate !== -1){
            updateOrganisation("rate", orgHourlyRate.toString());
        }
    }, [orgHourlyRate])

    const updateOrganisation = (property: string, value: string) => {
        const updatedOrganiation: editOrganisationDTO = produce(organisation, draftOrganisation => {
            switch (property) {
                case "id":
                    draftOrganisation.id = value;
                    break;
                case "name":
                    draftOrganisation.name = value;
                    break;
                case "rate":
                    draftOrganisation.hourlyRate = value;
                    break;
            }
        });

        setOrganisation(updatedOrganiation);
    }

    const handleEditClick = async () => {
        if (!validateEdit()) {
            try {
                const response: AxiosResponse<any> = await Axios.put(
                    `http://localhost:3000/organisations/${organisation.id}`,
                    {
                        name: organisation.name,
                        hourlyRate: +organisation.hourlyRate
                    },
                    {headers :{
                        "Authorization": sessionId,
                        "Content-Type": "application/json"
                }});

                if (response.status === 200) {
                    const {organisationName, ...details} = userDetails;
                    const updatedUserDetails = {organisationName: organisation.name, ...details};
                    updateUserDetails(updatedUserDetails);
                }
            } catch (ex) {
                console.log(ex);
            }
        }
    }

    const validateEdit = () => {
        const validationResults = Validation({name: organisation.name, number: organisation.hourlyRate}, ["name", "number"]);
        const errors = validationResults.errors;

        const updatedHelperText = produce(helperText, draftHelperText => {
            draftHelperText.name = errors["name"];
            draftHelperText.hourlyRate = errors["number"];
        });

        const updatedInputErrorFlags = produce(inputErrorFlags, draftInputErrorFlags => {
            if (errors.name !== "") {
                draftInputErrorFlags.name = true;
            } else draftInputErrorFlags.name = false;

            if (errors.number !== "") {
                draftInputErrorFlags.hourlyRate = true;
            } else draftInputErrorFlags.hourlyRate = false;
        });

        setHelperText(updatedHelperText);
        setInputErrorFlags(updatedInputErrorFlags);

        return validationResults.errorOccured;

    }

    const getOrganisationPayRate = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.get(
                `http://localhost:3000/organisations/${userDetails.organisationId}`,
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});

            if (response.status === 200) {
                setOrgHourlyRate(response.data.hourlyRate);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    return (
        <Container style={{borderStyle: "solid", borderColor: "grey", borderRadius: "20px", width: "25%", margin: "40px auto 0 auto"}}>
            <FormControl fullWidth style={{padding: "20px 0 20px 0"}}>
                <Typography variant="h6">Edit</Typography>
                <TextField
                    label="name"
                    color="secondary"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateOrganisation("name", event.target.value)}
                    value={organisation.name}
                    helperText={helperText.name}
                    error={inputErrorFlags.name}
                />
                <TextField
                    label="hourly rate"
                    color="secondary"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateOrganisation("rate", event.target.value)}
                    value={organisation.hourlyRate}
                    helperText={helperText.hourlyRate}
                    error={inputErrorFlags.hourlyRate}
                />
                <Button 
                    style={{width: "25%", margin: "25px auto 0 auto"}} 
                    color="secondary"
                    variant="outlined"
                    onClick={handleEditClick}
                > Submit</Button>
            </FormControl>
        </Container>
    );
};

export default OrganisationsEdit;