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