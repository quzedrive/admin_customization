
import React from 'react';
import { DollarSign } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { CarFormData } from '../types';

interface CarPricingProps {
    formData: CarFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errors: Record<string, string>;
}

export default function CarPricing({ formData, handleChange, errors }: CarPricingProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <DollarSign size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Pricing Configuration</h2>
                    <p className="text-sm text-gray-500">Set standard rates for the car</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FloatingInput
                    label="Base Price"
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    error={errors.basePrice}
                    icon={DollarSign}
                    color='blue'
                />
                <FloatingInput
                    label="Hourly Charge"
                    type="number"
                    name="hourlyCharge"
                    value={formData.hourlyCharge}
                    onChange={handleChange}
                    error={errors.hourlyCharge}
                    icon={DollarSign}
                    color='blue'
                />
                <FloatingInput
                    label="Addt. Hourly Charge"
                    type="number"
                    name="additionalHourlyCharge"
                    value={formData.additionalHourlyCharge}
                    onChange={handleChange}
                    error={errors.additionalHourlyCharge}
                    icon={DollarSign}
                    color='blue'
                />
            </div>
        </div>
    );
}
