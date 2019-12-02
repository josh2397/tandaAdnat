import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../components/authContext';
import PageLayout from '../../layout/pageLayout'
import { TextField, FormControl, FormControlLabel, Button, Link } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import produce from 'immer';
import { userLoginDTO } from '../../models/users';
import axios, { AxiosResponse } from 'axios';
import Validation from '../../global/validation';
import { RouteComponentProps } from 'react-router-dom';
import Cookies from '../../helpers/Cookies';


export default function Login (props: RouteComponentProps) {

    const authAPI = useContext(AuthContext);
    const updateAuthentication = authAPI.updateAuthentication ? authAPI.updateAuthentication : () =>{console.log("toggleAuthenticated is undefined")};

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
        const sessionId = Cookies.getCookieValue("sessionId");
        console.log("Sessionid: ", sessionId);
        if ((sessionId !== "") && (sessionId !== undefined)) {
            console.log("sessionId is valid");
            console.log("authenticated: ", authAPI.authenticated);
            updateAuthentication(true);
            props.history.push('/organisation');
        }
    }, [])

    useEffect(() => {
        console.log("remember:", remember);
        console.log("Cookie in login: ", document.cookie, "authenticated: ", authAPI.authenticated);
    }, [remember])

    const handleLoginClick = () => {
        //https://stackoverflow.com/questions/244882/what-is-the-best-way-to-implement-remember-me-for-a-website
        if (!validateLogin()) {
            try {
                console.log("trying to log in");
                axios.post('http://localhost:3000/auth/login', userLogin)
                    .then((response: AxiosResponse)=> {
                        console.log(response);
                        if (response.status === 200) {

                            updateAuthentication(true);
                            // console.log("Printing Authenticated after successful login: ", authAPI.authenticated);

                            if (remember) {
                                console.log(`token=${response.data.sessionId}`);
                                document.cookie = `sessionId=${response.data.sessionId}; Path=/;`;
                                console.log(document.cookie);
                                
                                props.history.push('/organisation');
                            } else {
                                console.log("printing from false remember")
                                props.history.push({
                                    pathname: "/organisation",
                                    state: { sessionId: response.data.sessionId }
                                });
                            }

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
                draftHelperText.email = errors["email"];
                draftHelperText.password = errors["password"];
        });
        const updatedInputErrorFlags = produce(inputErrorFlags, draftInputErrorFlags => {
            if (errors["email"] !== "") {
                draftInputErrorFlags.email = true;
            } else draftInputErrorFlags.email = false;
            if (errors["password"] !== "") {
                draftInputErrorFlags.password = true;
            } else draftInputErrorFlags.password = false;
        })
        setHelperText(updatedHelperText);
        setInputErrorFlags(updatedInputErrorFlags);
        console.log(validationResults.errorOccured);
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
                <Link href='/changepassword' variant='body2'>Change Password?</Link>

            </FormControl>
        </PageLayout>

    );
};  