import React, { useState, useEffect } from 'react';
import PageLayout from '../../layout/pageLayout'
import { Typography, TextField, FormControl, FormControlLabel, Button, Link } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import produce from 'immer';
import { userLoginDTO } from '../../models/users';
import axios from 'axios';
import Validation from './validation';

export default function Login () {

    const [remember, setRemember] = useState(false);
    const [userLogin, setUserLogin] = useState<userLoginDTO>({
        email: "",
        password: ""
    });

    const [helperText, setHelperText] = useState<userLoginDTO>({
        email: "",
        password: ""
    });

    const [inputErrorFlags, setInputErrorFlags] = useState({
        email: false,
        password: false
    });

    useEffect(() => {
        console.log("remember:", remember);
    }, [remember])

    const handleLoginClick = () => {
        
        console.log(validateLogin());

        
        // const response = axios.post('localhost:3000/auth/login', userLogin);
        
    }

    const validateLogin = () => {
        const validationResults = Validation([userLogin.email, userLogin.password], ['email', 'password']);
        const errors = validationResults.errors;
        
        const updatedHelperText = produce(helperText, draftHelperText => {
            if (errors["email"]) {
                draftHelperText.email = errors["email"][0];
            }
            if (errors["password"]) {
                draftHelperText.password = errors["password"][0];
            }
        });
        const updatedInputErrorFlags = produce(inputErrorFlags, draftInputErrorFlags => {
            if (errors["email"]) {
                draftInputErrorFlags.email = true;
            }
            if (errors["password"]) {
                draftInputErrorFlags.password = true;
            }
        })
        setHelperText(updatedHelperText);
        setInputErrorFlags(updatedInputErrorFlags);

        return validationResults.errorOccured;
    }

    const handleRemeberChange = () => ( event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    }

    const updateUser = (property: string, value: string) => {

        const updatedUser = produce(userLogin, draftUser => {
            switch (property) {
                case "email":
                    draftUser.email = value;
                    break;
                case "password":
                    draftUser.password = value;
                    break;
            }

        })

        setUserLogin(updatedUser);
    }




    return (
        <PageLayout title="Login">
            <FormControl color="primary" fullWidth style={{width: "25%"}}>
                <TextField
                    style={{marginTop: 80}}
                    label="Email"
                    onChange={(event) => updateUser("email", event.target.value)}
                    value={userLogin.email}
                    helperText={helperText.email}
                    error={inputErrorFlags.email}
                />
                <TextField
                    style={{marginTop: 20}}
                    label="Password"
                    onChange={(event) => updateUser("password", event.target.value)}
                    value={userLogin.password}
                    helperText={helperText.password}
                    error={inputErrorFlags.password}
                />
                <FormControlLabel
                    style={{marginTop: 20}}
                    control={
                        <Checkbox
                            checked={remember}
                            onChange={handleRemeberChange()}
                            color="primary"
                        />
                    }
                    label="Remember Me"
                />
                <Button style={{margin: "20px auto 0px auto", width: "25%"}} variant="contained" onClick={handleLoginClick}>Log In</Button>

                <Link style={{marginTop: 20}} href='/signup' variant='subtitle2'>Sign up</Link>
                <Link href='/password' variant='body2'>Forgot Password?</Link>

            </FormControl>
        </PageLayout>

    );
};  