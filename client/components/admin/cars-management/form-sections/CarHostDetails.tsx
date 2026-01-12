import React from 'react';
import { CarFormData } from '../types';
import FloatingInput from '@/components/inputs/FloatingInput';

interface CarHostDetailsProps {
    formData: CarFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    // We need a specific handler for nested host changes
    handleHostChange: (field: string, value: any) => void;
    handleHostDetailsChange: (field: string, value: string) => void;
    errors: Record<string, string>;
}

export default function CarHostDetails({ formData, handleHostChange, handleHostDetailsChange, errors }: CarHostDetailsProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-lg font-semibold text-gray-800">Host Details</h3>
            </div>

            <div className="space-y-6">
                {/* Host Type Selection */}
                <div className="space-y-6">
                    {/* <label className="text-sm font-medium text-gray-700">Host Type</label> */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hostType"
                                checked={formData.host.type === 1}
                                onChange={() => handleHostChange('type', 1)}
                                className="w-5 h-5 cursor-pointer text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Self Hosted</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hostType"
                                checked={formData.host.type === 2}
                                onChange={() => handleHostChange('type', 2)}
                                className="w-5 h-5 cursor-pointer text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Attachment</span>
                        </label>
                    </div>
                </div>

                {/* Conditional Details Fields */}
                {formData.host.type === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Host Contact Information</h4>
                        </div>
                        <FloatingInput
                            label="Host Name"
                            name="hostName"
                            value={formData.host.details?.name || ''}
                            onChange={(e: any) => handleHostDetailsChange('name', e.target.value)}
                            error={errors.hostName}
                            required
                            color='blue'
                        />
                        <FloatingInput
                            label="Email Address"
                            name="hostEmail"
                            type="email"
                            value={formData.host.details?.email || ''}
                            onChange={(e: any) => handleHostDetailsChange('email', e.target.value)}
                            error={errors.hostEmail}
                            required
                            color='blue'
                        />
                        <FloatingInput
                            label="Phone Number"
                            name="hostPhone"
                            type="tel"
                            value={formData.host.details?.phone || ''}
                            onChange={(e: any) => handleHostDetailsChange('phone', e.target.value)}
                            error={errors.hostPhone}
                            required
                            color='blue'
                        />
                        <FloatingInput
                            label="Aadhar Number (Optional)"
                            name="hostAadhar"
                            value={formData.host.details?.aadhar || ''}
                            onChange={(e: any) => handleHostDetailsChange('aadhar', e.target.value)}
                            color='blue'
                        // No error prop for optional field unless strict validation added later
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
