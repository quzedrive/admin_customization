
import React from 'react';
import { Truck } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { CarFormData } from '../types';

interface CarVehicleDetailsProps {
    formData: CarFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errors: Record<string, string>;
}

export default function CarVehicleDetails({ formData, handleChange, errors }: CarVehicleDetailsProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className='w-full flex justify-between items-center border-b border-gray-100 pb-4'>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <Truck size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Vehicle Identification</h2>
                        <p className="text-sm text-gray-500">Legal and registration details</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput
                    label="Vehicle Model"
                    name="vehicleModel"
                    value={formData.vehicleModel || ''}
                    onChange={handleChange}
                    error={errors.vehicleModel}
                    color='purple'
                />

                <FloatingInput
                    label="Registration Number"
                    name="registrationNumber"
                    value={formData.registrationNumber || ''}
                    onChange={handleChange}
                    error={errors.registrationNumber}
                    color='purple'
                />

                <FloatingInput
                    label="Engine Number"
                    name="engineNumber"
                    value={formData.engineNumber || ''}
                    onChange={handleChange}
                    error={errors.engineNumber}
                    color='purple'
                />

                <FloatingInput
                    label="Chassis Number"
                    name="chassisNumber"
                    value={formData.chassisNumber || ''}
                    onChange={handleChange}
                    error={errors.chassisNumber}
                    color='purple'
                />

                <FloatingInput
                    label="Registration Type"
                    name="registrationType"
                    value={formData.registrationType || ''}
                    onChange={handleChange}
                    error={errors.registrationType}
                    color='purple'
                />
            </div>
        </div>
    );
}
