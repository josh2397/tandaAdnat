import React, { useState, useEffect } from 'react';
import PageLayout from '../../layout/pageLayout';
import { Button } from '@material-ui/core';
import Axios, { AxiosResponse } from 'axios';
import Cookies from '../../helpers/Cookies';
import { userDetails } from '../../models/users';

export default class User {

    static getUser = async (sessionId?: string) => {
        console.log(sessionId);
        try {
            const response: AxiosResponse<userDetails> = await Axios.get('http://localhost:3000/users/me', {headers: {
                "Authorization": sessionId ? sessionId : Cookies.getCookieValue("sessionId"),
                "Content-Type": "application/json"
            }});
            if (response.status === 200) {
                const updatedUser : userDetails = response.data;
                return updatedUser;
            }
        } catch (ex) {
            console.log(ex);
        }

    }
};