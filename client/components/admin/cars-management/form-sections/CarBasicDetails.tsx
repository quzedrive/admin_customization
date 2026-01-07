
import React from 'react';
import { CarFront } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import FloatingTextarea from '@/components/inputs/FloatingTextarea';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import { CarFormData } from '../types';
import { CAR_TYPES, TRANSMISSION_TYPES, FUEL_TYPES } from '../constants';

interface CarBasicDetailsProps {
    formData: CarFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    errors: Record<string, string>;
    brands?: any[];
}

export default function CarBasicDetails({ formData, handleChange, handleSelectChange, errors, brands = [] }: CarBasicDetailsProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <CarFront size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Car Details</h2>
                    <p className="text-sm text-gray-500">Basic information about the vehicle</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <FloatingInput
                    label="Car Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    color='blue'
                />

                <FloatingInput
                    label="Seating Capacity"
                    type="number"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    error={errors.seatingCapacity}
                    color='blue'
                />

                <ModernDropdown
                    options={brands.map(b => ({ value: b.name, label: b.name }))}
                    value={formData.brand}
                    onChange={(val) => handleSelectChange('brand', val)}
                    placeholder="Select Brand"
                    error={errors.brand}
                />

                <ModernDropdown
                    options={CAR_TYPES}
                    value={formData.type}
                    onChange={(val) => handleSelectChange('type', val)}
                    placeholder="Select Type"
                    error={errors.type}
                />

                <ModernDropdown
                    options={TRANSMISSION_TYPES}
                    value={formData.transmission}
                    onChange={(val) => handleSelectChange('transmission', val)}
                    placeholder="Select Transmission"
                    error={errors.transmission}
                />

                <ModernDropdown
                    options={FUEL_TYPES}
                    value={formData.fuelType}
                    onChange={(val) => handleSelectChange('fuelType', val)}
                    placeholder="Select Fuel Type"
                    error={errors.fuelType}
                />


            </div>

            <div className="space-y-4 pt-2">
                <FloatingTextarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the car..."
                    rows={4}
                    color='blue'
                />
            </div>
        </div>
    );
}
