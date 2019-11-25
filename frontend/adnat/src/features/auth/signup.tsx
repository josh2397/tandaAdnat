import React from 'react';
import PageLayout from '../../layout/pageLayout'
import { FormControl, Button } from '@material-ui/core';
import { userSignupDTO } from '../../models/users';
import axios from 'axios';

export default function Signup () {

    const handleSignupClick = () => {
        axios.post('http://localhost:3000/auth/signup', {
            name: "Josh", 
            email: "josh@gmail.com",
            password: "12345678",
            passwordConfirmation: "12345678"
        }).then((response) => {
            console.log(response);
        })
    }

    

    return (
        <PageLayout title="Signup">
            <FormControl>
                <Button onClick={handleSignupClick}>Submit</Button>
            </FormControl>
        </PageLayout>
    );
};