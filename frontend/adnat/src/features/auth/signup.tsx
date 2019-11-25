import React, { useState } from 'react';
import PageLayout from '../../layout/pageLayout'
import { FormControl, Button, TextField, Link } from '@material-ui/core';
import { userSignupDTO } from '../../models/users';
import Validation from './validation';
import axios from 'axios';
import produce from 'immer';

export default function Signup () {

    const [userSignup, setUserSignup] = useState<userSignupDTO>({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    });

    const [helperText, setHelperText] = useState<userSignupDTO>({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    });

    const [inputErrorFlags, setInputErrorFlags] = useState({
        name: false,
        email: false,
        password: false,
        passwordConfirmation: false
    });
 
    const handleSignupClick = () => {

        if (!validateSignup()) {
            try {
                axios.post('http://localhost:3000/auth/signup', userSignup)
                    .then((response) => {
                        if (response.status === 200) {
                            console.log(response.data);
                        }
                    })

            } catch (ex) {
                console.log(ex);
            }

        }
    }

    const validateSignup = () => {
        const validationResults = Validation({name: userSignup.name, email: userSignup.email, password: userSignup.password, passwordConfirmation: userSignup.passwordConfirmation}, ["name", "email", "password", "passwordConfirmation"]);
        const errors = validationResults.errors;

        const updatedHelperText = produce(helperText, draftHelperText => {
            draftHelperText.name = errors["name"][0];
            draftHelperText.email = errors["email"][0];
            draftHelperText.password = errors["password"][0];
            draftHelperText.passwordConfirmation = errors["confirmPassword"][0];
        });

        const updatedInputerErrorFlags = produce(inputErrorFlags, draftInputErrorFlags => {
            if (errors.name !== "") {
                draftInputErrorFlags.name = true;
            } else draftInputErrorFlags.name = false;

            if (errors.email !== "") {
                draftInputErrorFlags.email = true;
            } else draftInputErrorFlags.email = false;

            if (errors.password !== "") {
                draftInputErrorFlags.password = true;
            } else draftInputErrorFlags.password = false;

            if (errors.passwordConfirmation !== "") {
                draftInputErrorFlags.passwordConfirmation = true;
            } else draftInputErrorFlags.passwordConfirmation = false;
        });

        setHelperText(updatedHelperText);
        setInputErrorFlags(updatedInputerErrorFlags);

        return validationResults.errorOccured;
    }


    const updateUser = (property: string, value: string) => {
        const updatedUser = produce(userSignup, draftUserSignup => {
            switch (property) {
                case "name":
                    draftUserSignup.name = value;
                    break;
                case "email":
                    draftUserSignup.email = value;
                    break;
                case "password":
                    draftUserSignup.password = value;
                    break;
                case "passwordConfirmation":
                    draftUserSignup.passwordConfirmation = value;
                    break;
            }
        });

        setUserSignup(updatedUser);
    }
    

    return (
        <PageLayout title="Signup">
            <FormControl color="primary" fullWidth style={{width: "25%"}}>
                <TextField
                    style={{marginTop: 80}}
                    label="Name"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateUser("name", event.target.value)}
                    value={userSignup.name}
                    helperText={helperText.name}
                    error={inputErrorFlags.name}
                />
                <TextField
                    style={{marginTop: 20}}
                    label="Email"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateUser("email", event.target.value)}
                    value={userSignup.email}
                    helperText={helperText.email}
                    error={inputErrorFlags.email}
                />
                <TextField
                    style={{marginTop: 20}}
                    label="Password"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateUser("password", event.target.value)}
                    value={userSignup.password}
                    helperText={helperText.password}
                    error={inputErrorFlags.password}
                />
                <TextField
                    style={{marginTop: 20}}
                    label="Confirm Password"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateUser("passwordConfirmation", event.target.value)}
                    value={userSignup.passwordConfirmation}
                    helperText={helperText.passwordConfirmation}
                    error={inputErrorFlags.passwordConfirmation}
                />

                <Button style={{margin: "40px auto 0px auto", width: "25%"}} variant="contained" onClick={handleSignupClick}>Signup</Button>

                <Link style={{marginTop: 20}} href='/login' variant='subtitle2'>Log in</Link>
            </FormControl>
        </PageLayout>
    );
};