import React, { useState, useEffect } from 'react';
import PageLayout from '../layout/pageLayout'
import { Typography, TextField, FormControl, FormControlLabel, Button, Link } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import produce from 'immer';

interface userLoginDTO {
    email: string;
    password: string;
}

export default function Login () {

    const [remember, setRemember] = useState(false);
    const [user, setUser] = useState<userLoginDTO>({email: "", password: ""});

    useEffect(() => {
        console.log("remember:", remember);
    }, [remember])

    const handleLoginClick = () => {
        
    }

    const handleRemeberChange = () => ( event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    }

    const updatedUser = produce(user, draftUser => {
        draftUser.email = user.email;
    })

    const updateUser = (property: string, value: string) => {
        const newUser : userLoginDTO = user;

        switch (property) {
            case "email":
                newUser.email = value;
            case "password":
                newUser.password = value;
            break
        }

        setUser(newUser);
    }




    return (
        <PageLayout title="Login">
            <FormControl color="primary" fullWidth style={{width: "25%"}}>
                <TextField
                    style={{marginTop: 80}}
                    label="Email"
                    onChange={(event) => updateUser("email", event.target.value)}
                    value={user.email}
                />
                <TextField
                    style={{marginTop: 20}}
                    label="Password"
                    onChange={(event) => updateUser("password", event.target.value)}
                    value={user.password}
                    
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