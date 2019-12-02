import React, { FunctionComponent, useState } from 'react';
import PageLayout from '../../layout/pageLayout';
import { RouteComponentProps } from 'react-router';
import { Container, FormControl, TextField, Card, CardContent, Button, CardActions } from '@material-ui/core';
import { userChangePasswordDTO } from '../../models/users';
import produce from 'immer';

const ChangePassword: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const [passwords, setPasswords]= useState<userChangePasswordDTO>({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: ""
    });
 
    const handleCancelClick = () => {
        history.push("/login");
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
                    <Button color="primary">Change Password</Button>
                    <Button onClick={handleCancelClick}>Cancel</Button>
                </CardActions>
            </PageLayout>
        </Card>
    );
};

export default ChangePassword;