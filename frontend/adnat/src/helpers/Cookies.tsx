import React from 'react';
import { ReactComponent } from '*.svg';

export default class Cookies {

    static getCookieValue (name: string) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2];
        }
    }

    static deleteCookie (name: string) {
        document.cookie = `${name}= ;`
    }
};