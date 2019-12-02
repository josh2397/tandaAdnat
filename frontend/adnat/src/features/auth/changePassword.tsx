import React, { FunctionComponent, useState } from 'react';
import PageLayout from '../../layout/pageLayout';
import { RouteComponentProps } from 'react-router';
import { Container, FormControl, TextField, Card, CardContent, Button, CardActions } from '@material-ui/core';
import { userChangePasswordDTO } from '../../models/users';
import produce from 'immer';
import Axios, { AxiosResponse } from 'axios';
import Validation from '../../global/validation';
import Cookies from '../../helpers/Cookies';

const ChangePassword: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const [passwords, setPasswords]= useState<userChangePasswordDTO>({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: ""
    });

    const [helperText, setHelperText] = useState<userChangePasswordDTO>({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: ""
    });

    const [inputErrorFlags, setInputErrorFlags] = useState({
        oldPassword: false,
        newPassword: false,
        newPasswordConfirmation: false
    });

    const [sessionId, setSessionId] = useState(location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId"));    
 
    const handleCancelClick = () => {
        history.push("/login");
    }

    const handleChangePasswordClick = async () => {

        console.log(sessionId)

        if (!validatePasswords()) {
            try {
                const response: AxiosResponse<any> = await Axios.post(
                    'http://localhost:3000/users/me/change_password',
                    passwords,
                    {headers: {
                        "Authorization": sessionId,
                        "Content-Type": "application/json"
                }});

                if (response.status === 200) {
                    console.log("Succesfully changed password");
                }
            } catch (ex) {
                console.log(ex);
            }
        }
    }

    const validatePasswords = () => {
        const validationResults = Validation({password: passwords.newPassword, confirmPassword: passwords.newPasswordConfirmation}, ["password", "confirmPassword"]);

        const errors = validationResults.errors;

        const updatedHelperText = produce(helperText, draftHelperText => {
            draftHelperText.newPassword = errors["password"];
            draftHelperText.newPasswordConfirmation = errors["confirmPassword"];
        });

        const updatedInputErrorFlags = produce(inputErrorFlags, draftInputErrorFlags => {
            if (errors.password !== "") {
                draftInputErrorFlags.newPassword = true;
            } else draftInputErrorFlags.newPassword = false;
            
            if (errors.confirmPassword !== "") {
                draftInputErrorFlags.newPasswordConfirmation = true;
            } else draftInputErrorFlags.newPasswordConfirmation = false;
        });

        setHelperText(updatedHelperText);
        setInputErrorFlags(updatedInputErrorFlags);

        return validationResults.errorOccured;
    }

    const updatePasswords = (property: string, value: string) => {
        const updatedPasswords: userChangePasswordDTO = produce(passwords, draftPasswords => {
            switch (property) {
                case "oldPassword":
                    draftPasswords.oldPassword = value;
                    break;
                case "newPassword":
                    draftPasswords.newPassword = value;
                    break;
                case "newPasswordConfirmation":
                    draftPasswords.newPasswordConfirmation = value;
                    break;
            }
        });

        setPasswords(updatedPasswords);
}

    return (
        <Card style={{width: "40%", margin: "40px auto 0 auto"}}>
            <PageLayout title="Change Password">
                <CardContent>
                    <FormControl>
                        <TextField
                            style={{marginTop: 20}}
                            label="Old Password"
                            value={passwords.oldPassword}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updatePasswords("oldPassword", event.target.value)}
                        />
                        <TextField
                            style={{marginTop: 20}}
                            label="New Password"
                            value={passwords.newPassword}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updatePasswords("newPassword", event.target.value)}
                        />
                        <TextField
                            style={{marginTop: 20}}
                            label="Confirm New Password"
                            value={passwords.newPasswordConfirmation}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updatePasswords("newPasswordConfirmation", event.target.value)}
                        />
                    </FormControl>
                </CardContent>

                <CardActions>
                    <Button onClick={handleChangePasswordClick} color="primary">Change Password</Button>
                    <Button onClick={handleCancelClick}>Cancel</Button>
                </CardActions>
            </PageLayout>
        </Card>
    );
};

export default ChangePassword;