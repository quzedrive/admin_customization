
import React from 'react';
import { List } from 'lucide-react';
import ImageField from '@/components/inputs/ImageField';
import { CarFormData } from '../types';

interface CarMediaProps {
    formData: CarFormData;
    handleImageUpload: (files: File[] | File | null) => void;
    handleImageChange: (value: any) => void;
    uploading: boolean;
    errors: Record<string, string>;
}

export default function CarMedia({ formData, handleImageUpload, handleImageChange, uploading, errors }: CarMediaProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <List size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Car Images</h2>
                    <p className="text-sm text-gray-500">Upload multiple images for the car gallery.</p>
                </div>
            </div>

            <div className="space-y-4">
                <ImageField
                    label="Car Gallery"
                    multiple={true}
                    maxFiles={10}
                    onChange={(val) => handleImageChange(val)}
                    onFileChange={(files) => handleImageUpload(files as File[])}
                    value={formData.images}
                    disabled={uploading}
                />
                {uploading && <div className="text-sm text-blue-600 animate-pulse">Uploading images...</div>}
                {errors.images && (
                    <p className="text-sm text-red-500">{errors.images}</p>
                )}
            </div>
        </div>
    );
}
