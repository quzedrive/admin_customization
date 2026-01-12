
export interface Specification {
    icon: string;
    text: string;
}

export interface CarPackage {
    package: string; // ID
    price: number | '';
    discountPrice?: number | '';
    isActive: boolean;
    _id?: string; // mapping ID
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
    status: number;
}
