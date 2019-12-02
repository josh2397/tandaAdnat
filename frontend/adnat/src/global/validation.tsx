import validate from 'validate.js';

interface inputValidationTypes {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    number?: string;
}

export default function Validation (values: inputValidationTypes, rules: string[]) {
    const nameContraints = {
        name : {
            presence: true,
            type: "string",
            length: {
                minimum: 1
            }
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
            }
        }
    };

    const confirmPasswordContraints = {
        confirmPassword: {
            presence: true,
            equality: "password"
        }
    }

    const numberContraints = {
        number : {
            presence: true,
            numericality: true
        }
    }

    let errorOccured = false;

    const resultWithEmpty = (result: any, emptyObject: object) => {
        if (!result) {
            return emptyObject;
        } else {
            errorOccured = true;
            return result;
        }
    }

    const errors = rules.map((rule) => {
        let result;
        switch (rule) {

            case "name":
                result = validate({name: values["name"]}, nameContraints);
                return resultWithEmpty(result, {name: ""});
            
            case "email":
                result = validate({email: values["email"]}, emailContraints);
                return resultWithEmpty(result, {email: ""});

            case "password":
                result = validate({password: values["password"]}, passwordContraints);
                return resultWithEmpty(result, {password: ""});


            case "confirmPassword":
                result = validate({password: values["password"], confirmPassword: values["confirmPassword"]}, confirmPasswordContraints);
                return resultWithEmpty(result, {confirmPassword: ""});

            case "number":
                result = validate({number: values["number"]}, numberContraints);
                return resultWithEmpty(result, {number: ""});
                
        }
           
    }).reduce((error, current) => {
        
        Object.entries(current).forEach(([k, v]) => {
            error[k] = v;
        });
        return error;

    }, {});

    return {errors: errors, errorOccured: errorOccured};
}
