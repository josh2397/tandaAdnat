import React, { useState, useEffect } from 'react';
import PageLayout from '../../layout/pageLayout'
import { Typography, TextField, FormControl, FormControlLabel, Button, Link } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import produce from 'immer';
import { userLoginDTO } from '../../models/users';
import axios from 'axios';

export default function Login () {

    const [remember, setRemember] = useState(false);
    const [userLogin, setUserLogin] = useState<userLoginDTO>({
        email: "",
        password: ""
    });

    useEffect(() => {
        console.log("remember:", remember);
    }, [remember])

    const handleLoginClick = () => {
        const response = axios.post('localhost:3000/auth/login', userLogin);
        console.log(response); 
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
                />
                <TextField
                    style={{marginTop: 20}}
                    label="Password"
                    onChange={(event) => updateUser("password", event.target.value)}
                    value={userLogin.password}
                    
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