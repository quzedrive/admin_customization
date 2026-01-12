export type UserForm = {
    name: string;
    phone: string;
    email: string;
    tripStart: Date | string;
    tripEnd: Date | string;
    carId?: string;
    carName?: string;
    carSlug?: string;
    location?: string;
    message: string;
    selectedPackage?: string;
    securityAnswer?: string;
};

export type UserFormError = {
    location?: string;
    tripStart?: string;
    tripEnd?: string;
    name?: string;
    phone?: string;
    message?: string;
    email?: string;
    car?: string;
    securityAnswer?: string;
};