import React, { useState, useEffect } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import ImageField from '@/components/inputs/ImageField';
import { Save } from 'lucide-react';
import Link from 'next/link';

interface PackageFormProps {
    initialData?: {
        name: string;
        time: string;
        image?: string;
        status: number;
    };
    onSubmit: (data: any) => void;
    isLoading: boolean;
    isEditMode?: boolean;
    onCancelUrl: string;
}

export default function PackageForm({
    initialData,
    onSubmit,
    isLoading,
    isEditMode = false,
    onCancelUrl
}: PackageFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        time: initialData?.time || '',
        image: initialData?.image || '',
        status: initialData?.status?.toString() || '1'
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                time: initialData.time,
                image: initialData.image || '',
                status: initialData.status.toString()
            });
        }
    }, [initialData]);

    const handleFileChange = (file: File | File[] | null) => {
        if (file && !Array.isArray(file)) {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('time', formData.time);
        submitData.append('status', formData.status);

        if (selectedFile) {
            submitData.append('image', selectedFile);
        } else if (formData.image) {
            submitData.append('image', formData.image);
        }

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                        Package Details
                    </h3>

                    <FloatingInput
                        id="name"
                        label="Package Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        color='blue'
                    />

                    <FloatingInput
                        id="time"
                        label="Time Duration"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        color='blue'
                        placeholder="e.g., 30 days, 1 month"
                    />

                    <ModernDropdown
                        label="Status"
                        options={[
                            { value: '1', label: 'Active' },
                            { value: '2', label: 'Inactive' }
                        ]}
                        value={formData.status}
                        onChange={(val) => setFormData({ ...formData, status: val })}
                    />

                    <ImageField
                        label="Package Image"
                        value={formData.image}
                        onChange={(val) => setFormData({ ...formData, image: val as string })}
                        onFileChange={handleFileChange}
                        maxFiles={1}
                        maxSizeMB={2}
                        helperText="Upload package image (PNG, JPG, SVG)"
                        enableCrop={true}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <Link
                    href={onCancelUrl}
                    className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} transition-all shadow-sm hover:shadow`}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isEditMode ? 'Updating...' : 'Creating...'}
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            {isEditMode ? 'Update Package' : 'Create Package'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
