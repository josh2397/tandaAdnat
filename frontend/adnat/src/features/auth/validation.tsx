import React from 'react';
import validate from 'validate.js';

export default function Validation (values: string[], rules: string[]) {
    const emailContraints = {
        email: {
            presence: true,
            email: {
                message: "is invalid"
            }
        }  
    };

    const passwordContrains = {
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
            equality: "password",
            format: {
                message: "Passwords must match"
            }
        }
    }

    let errorOccured = false;

    const errors =  rules.map((rule, i) => {
        console.log(rule, i);
        console.log(values[i]);
        let result;
        switch (rule) {
            
            case "email":
                errorOccured = true;
                result = validate({email: values[i]}, emailContraints);
                if (!result) {
                    return {email: ""}
                } else return result;

            case "password":
                errorOccured = true;
                result = validate({password: values[i]}, passwordContrains);
                if (!result) {
                    return {password: ""}
                } else return result;

            // case "confirmPassword":
            //     return validate({confirmPassword: values[i]}, confirmPasswordContraints)
        }
    }).reduce((error, current) => {
        console.log(error, current);
        
        Object.entries(current).forEach(([k, v]) => {
            console.log(k, v);
            error[k] = v;
        });
        return error;

        
    }, {});

    // const error = Object.assign({}, ...errorArray.map(object => ({})))



    return {errors: errors, errorOccured: errorOccured};


}