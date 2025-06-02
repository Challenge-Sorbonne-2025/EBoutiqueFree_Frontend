export interface UserProfileResponse{
    profile_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole;
}

export enum UserRole {
    GESTIONNAIRE = 'GESTIONNAIRE',
    RESPONSABLE = 'RESPONSABLE',
}

export interface UserCreateOrEdit{
    profile_id?: number;
    role: string;
    telephone: string;
    username: string;    
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}
