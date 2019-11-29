export interface userLoginDTO {
    email: string;
    password: string;
}

export interface userSignupDTO {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface userDetails {
    id: number;
    organisationId: number;
    name: string;
    email: string;
}

export interface IUserDetails {
    id: number;
    name: string;
    organisationId: number;
    organisationName: string;
}