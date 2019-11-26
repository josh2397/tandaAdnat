import React, { useState, SyntheticEvent } from 'react';
import PageLayout from '../../layout/pageLayout'
import { FormControl, Button, TextField, Link, Snackbar, SnackbarContent, makeStyles, Theme } from '@material-ui/core';
import { SnackbarOrigin } from '@material-ui/core/Snackbar'
import { userSignupDTO } from '../../models/users';
import Validation from './validation';
import axios from 'axios';
import produce from 'immer';
import { green } from '@material-ui/core/colors';
import { RouteComponentProps } from 'react-router';

const useStyles = makeStyles((theme: Theme) => ({
    success: {
      backgroundColor: green[600],
    }
}));

export default function Signup (props: RouteComponentProps) {

    const classes = useStyles();

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
        confirmPassword: false
    });

    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

    const handleSuccessSnackBarClose = (event?: SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setOpenSuccessSnackbar(false);
    };
 
    const handleSignupClick = () => {

        if (!validateSignup()) {
            try {
                axios.post('http://localhost:3000/auth/signup', userSignup)
                    .then((response) => {
                        if (response.status === 200) {
                            console.log(response.data);
                            setOpenSuccessSnackbar(true);
                            setTimeout(function() {
                                props.history.push('/login');
                            }, 3000);
                        }
                    })

            } catch (ex) {
                console.log(ex);
            }

        }
    }

    const validateSignup = () => {
        const validationResults = Validation({name: userSignup.name, email: userSignup.email, password: userSignup.password, confirmPassword: userSignup.passwordConfirmation}, ["name", "email", "password", "confirmPassword"]);
        const errors = validationResults.errors;

        const updatedHelperText = produce(helperText, draftHelperText => {
            draftHelperText.name = errors["name"];
            draftHelperText.email = errors["email"];
            draftHelperText.password = errors["password"];
            draftHelperText.passwordConfirmation = errors["confirmPassword"];
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

            if (errors.confirmPassword !== "") {
                draftInputErrorFlags.confirmPassword = true;
            } else draftInputErrorFlags.confirmPassword = false;
        });

        console.log(updatedInputerErrorFlags);
        console.log(errors, updatedHelperText);

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
                case "confirmPassword":
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
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateUser("confirmPassword", event.target.value)}
                    value={userSignup.passwordConfirmation}
                    helperText={helperText.passwordConfirmation}
                    error={inputErrorFlags.confirmPassword}
                />

                <Button style={{margin: "40px auto 0px auto", width: "25%"}} variant="contained" onClick={handleSignupClick}>Signup</Button>

                <Link style={{marginTop: 20}} href='/login' variant='subtitle2'>Log in</Link>
            </FormControl>
            <Snackbar
                style={{backgroundColor: "green[600]"}}
                open={openSuccessSnackbar}
                onClose={handleSuccessSnackBarClose}
                autoHideDuration={2000}
                message={
                    <>
                        <span>Successfully Signed Up</span><br/>
                        <span>Returning to Login...</span>
                    </>
                }
            >
                <SnackbarContent
                    className={classes.success}
                    message={
                        <span>Successfully Signed Up. Moving to login...</span>
                    }
                />
            </Snackbar>
        </PageLayout>
    );
};