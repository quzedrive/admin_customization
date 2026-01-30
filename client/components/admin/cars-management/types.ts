
export interface Specification {
    icon: string;
    text: string;
}

export interface CarPackage {
    package: string; // ID
    price: number | '';
    discountPrice?: number | '';
    halfDayPrice?: number | '';
    isActive: boolean;
    _id?: string; // mapping ID
}


export interface HostDetails {
    type: number; // 1: Self Hosted, 2: Attachment
    details?: {
        name: string;
        email: string;
        phone: string;
        aadhar?: string;
    };
}

export interface CarFormData {
    brand: string;
    name: string;
    slug: string;
    type: string;
    transmission: string;
    fuelType: string;
    seatingCapacity: number;
    basePrice: number | '';
    hourlyCharge: number | '';
    additionalHourlyCharge: number | '';
    description: string;
    images: string[];
    specifications: Specification[];
    packages: CarPackage[];
    host: HostDetails;
    status: number;
    vehicleModel?: string;
    registrationNumber?: string;
    engineNumber?: string;
    chassisNumber?: string;
    registrationType?: string;
}
