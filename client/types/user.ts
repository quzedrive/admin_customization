export type UserForm = {
    name: string;
    phone: string;
    email : string;
    tripStart: Date | string;
    tripEnd: Date | string;
    location: string;
    message: string;
    securityAnswer?: string;
};

export type UserFormError = {
    location: string;
    tripStart: string;
    tripEnd: string;
    name: string;
    phone: string;
    message: string;
    securityAnswer?: string;
};