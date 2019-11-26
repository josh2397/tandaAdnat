import React from 'react';
import validate from 'validate.js';

interface inputValidationTypes {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function Validation (values: inputValidationTypes, rules: string[]) {
    const nameContraints = {
        name : {
            presence: true,
            type: "string" 
        }
    }

    const emailContraints = {
        email: {
            presence: true,
            email: {
                message: "is invalid"
            }
        }  
    };

    const passwordContraints = {
        password: {
            presence: true,
            length: {
                minimum: 8,
                message: "must have a minimum length of 8 characters"
            }
        }
    };

    const confirmPasswordContraints = {
        confirmPassword: {
            presence: true,
            equality: "password"
        }
    }

    let errorOccured = false;

    const errors = rules.map((rule) => {
        let result;
        switch (rule) {

            case "name":
                result = validate({name: values["name"]}, nameContraints)
                if (!result) {
                    return {name: ""}
                } else {
                    errorOccured = true;
                    return result;
                }
            
            case "email":
                result = validate({email: values["email"]}, emailContraints);
                if (!result) {
                    return {email: ""}
                } else {
                    errorOccured = true;
                    return result;
                }

            case "password":
                result = validate({password: values["password"]}, passwordContraints);
                if (!result) {
                    return {password: ""}
                } else {
                    errorOccured = true;
                    return result;
                }

            case "confirmPassword":
                result = validate({password: values["password"], confirmPassword: values["confirmPassword"]}, confirmPasswordContraints);
                if (!result) {
                    return {confirmPassword: ""}
                } else {
                    errorOccured = true;
                    return result;
                }
        }
    }).reduce((error, current) => {
        
        Object.entries(current).forEach(([k, v]) => {
            error[k] = v;
        });
        return error;

    }, {});

    return {errors: errors, errorOccured: errorOccured};
}
