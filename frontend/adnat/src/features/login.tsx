import React, { useState } from 'react';
import PageLayout from '../layout/pageLayout'
import { Typography, TextField, FormControl, FormControlLabel, Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

export default function Login () {

    const [remember, setRemember] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleLogin = () => {
        
    }

    const handleRemeberChange = () => ( event: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(event.target.checked);
    }


    return (
        <PageLayout title="Login">
            <FormControl color="primary">
                <TextField
                    label="Email"
                    
                />
                <TextField
                    label="Password"
                    
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={remember}
                            onChange={handleRemeberChange()}
                            color="primary"
                        />
                    }
                    label="Remember Me"
                />
                <Button onClick={handleLogin}>Log In</Button>

            </FormControl>
        </PageLayout>

    );
};  