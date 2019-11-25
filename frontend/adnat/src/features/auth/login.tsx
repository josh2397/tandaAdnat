import React, { useState, useEffect } from 'react';
import PageLayout from '../../layout/pageLayout'
import { Typography, TextField, FormControl, FormControlLabel, Button, Link } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import produce from 'immer';
import { userLoginDTO } from '../../models/users';
import axios, { AxiosResponse } from 'axios';
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
        
        if (!validateLogin()) {
            try {
                axios.post('http://localhost:3000/auth/login', userLogin)
                    .then((response: AxiosResponse)=> {
                        console.log(response);
                        if (response.status === 200) {
                            console.log(response.data);
                        }
                    });
    
            } catch (ex) {
                console.log(ex);
            }
            
        }

        
    }

    const validateLogin = () => {
        const validationResults = Validation({email: userLogin.email, password: userLogin.password}, ['email', 'password']);
        const errors = validationResults.errors;
        
        const updatedHelperText = produce(helperText, draftHelperText => {
                draftHelperText.email = errors["email"][0];
                draftHelperText.password = errors["password"][0];
        });
        const updatedInputErrorFlags = produce(inputErrorFlags, draftInputErrorFlags => {
            if (errors.email !== "") {
                draftInputErrorFlags.email = true;
            } else draftInputErrorFlags.email = false;
            if (errors.password !== "") {
                draftInputErrorFlags.password = true;
            } else draftInputErrorFlags.password = false;
        })
        setHelperText(updatedHelperText);
        setInputErrorFlags(updatedInputErrorFlags);

        return validationResults.errorOccured;
    }

    const handleRemeberChange = () => ( event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    }

    const updateUser = (property: string, value: string) => {

        const updatedUser = produce(userLogin, draftUserLogin => {
            switch (property) {
                case "email":
                    draftUserLogin.email = value;
                    break;
                case "password":
                    draftUserLogin.password = value;
                    break;
            }

        });
        setUserLogin(updatedUser);
    }




    return (
        <PageLayout title="Login">
            <FormControl color="primary" fullWidth style={{width: "25%"}}>
                <TextField
                    style={{marginTop: 80}}
                    label="Email"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateUser("email", event.target.value)}
                    value={userLogin.email}
                    helperText={helperText.email}
                    error={inputErrorFlags.email}
                />
                <TextField
                    style={{marginTop: 20}}
                    label="Password"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateUser("password", event.target.value)}
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
                <Button style={{margin: "40px auto 0px auto", width: "25%"}} variant="contained" onClick={handleLoginClick}>Log In</Button>

                <Link style={{marginTop: 20}} href='/signup' variant='subtitle2'>Sign up</Link>
                <Link href='/password' variant='body2'>Forgot Password?</Link>

            </FormControl>
        </PageLayout>

    );
};  