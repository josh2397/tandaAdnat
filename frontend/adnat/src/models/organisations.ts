export interface createOrganisationDTO {
    name: string;
    rate: number;
}

export interface editOrganisationDTO {
    id: string;
    name: string;
    hourlyRate: number;
}

export interface organisationListDTO {
    id: number;
    name: string;
    hourlyRate: number;
}

export interface organisationShift {
    id: number;
    userId: number;
    name: string;
    date: string;
    start: string;
    finish: string;
    break: number;
    worked: number;
    cost: number;
}

export interface organisationCreateShiftDTO {
    [key: string]: number | string | undefined | Date;
    userId: number;
    date: Date;
    start: Date;
    finish: Date;
    breakLength ? : number;

}

export interface organisationGetShifts {
    id: number;
    userId: number;
    start: string;
    finish: string;
    breakLength? : number;

}