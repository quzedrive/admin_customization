
'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { usePackageQueries } from '@/lib/hooks/queries/usePackageQueries';
import { useBrandQueries } from '@/lib/hooks/queries/useBrandQueries';
import { useCarMutations } from '@/lib/hooks/mutations/useCarMutations';
import { fileServices } from '@/lib/services/fileServices';
import { toast } from 'react-hot-toast';

import { CarFormData } from './types';
import CarBasicDetails from './form-sections/CarBasicDetails';
import CarPricing from './form-sections/CarPricing';
import CarMedia from './form-sections/CarMedia';
import CarSpecifications from './form-sections/CarSpecifications';
import CarPackages from './form-sections/CarPackages';

interface CarFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function CarForm({ initialData, isEditMode = false }: CarFormProps) {
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<CarFormData>({
        brand: '',
        name: '',
        type: '',
        transmission: '',
        fuelType: '',
        seatingCapacity: 4,
        basePrice: '',
        hourlyCharge: '',
        additionalHourlyCharge: '',
        description: '',
        images: [],
        specifications: [],
        packages: []
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch Packages
    const { useAdminPackages } = usePackageQueries();
    const { data: packagesData, isLoading: packagesLoading } = useAdminPackages({ page: 1, limit: 100, search: '', status: 1 });

    // Fetch Brands
    // Fetch Brands
    const { usePublicBrands } = useBrandQueries();
    const { data: brandsData, isLoading: brandsLoading } = usePublicBrands({ page: 1, limit: 100, search: '' });


    const { createCarMutation, updateCarMutation } = useCarMutations();
    const isSubmitting = createCarMutation.isPending || updateCarMutation.isPending;

    const availablePackages = packagesData?.packages || [];

    // Initialize Form Data
    useEffect(() => {
        if (initialData) {
            const imageUrls = initialData.images?.map((img: any) => img.url) || [];

            const specs = initialData.specifications?.map((spec: any) => ({
                icon: spec.icon,
                text: spec.text
            })) || [];

            setFormData(prev => ({
                ...prev,
                brand: initialData.brand || '',
                name: initialData.name || '',
                type: initialData.type || '',
                transmission: initialData.transmission || '',
                fuelType: initialData.fuelType || '',
                seatingCapacity: initialData.seatingCapacity || 4,
                basePrice: initialData.basePrice || '',
                hourlyCharge: initialData.hourlyCharge || '',
                additionalHourlyCharge: initialData.additionalHourlyCharge || '',
                description: initialData.description || '',
                images: imageUrls,
                specifications: specs
            }));
        }
    }, [initialData]);

    // Initialize Packages separately to wait for availablePackages
    useEffect(() => {
        if (availablePackages.length > 0) {
            const existingMap = new Map();
            if (initialData?.packages) {
                initialData.packages.forEach((p: any) => {
                    // p.package is populated object, p.price, p.isActive, p.isAvailable
                    existingMap.set(p.package._id, { price: p.price, isActive: p.isActive, isAvailable: p.isAvailable, _id: p._id });
                });
            }

            setFormData(prev => {
                if (prev.packages.length > 0 && !initialData) return prev; // already set? 

                // Construct the package list based on ALL available packages
                const initPackages = availablePackages.map((pkg: any) => {
                    const existing = existingMap.get(pkg._id);
                    return {
                        package: pkg._id,
                        price: existing?.price ?? '',
                        isActive: existing ? existing.isActive : false,
                        isAvailable: existing ? existing.isAvailable : true, // Default available?
                        _id: existing?._id // keep existing mapping ID if present
                    };
                });

                return { ...prev, packages: initPackages };
            });
        }
    }, [availablePackages, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number'
                ? (value === '' ? '' : parseFloat(value))
                : value
        }));
        // Clear error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageUpload = async (files: File[] | File | null) => {
        if (!files) return;

        const fileList = Array.isArray(files) ? files : [files];
        if (fileList.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = fileList.map(file => fileServices.uploadFile(file, 'cars'));
            const results = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...results]
            }));
            if (errors.images) setErrors(prev => ({ ...prev, images: '' }));

        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    // Specifications Handlers
    const addSpec = (spec?: { icon: string; text: string }) => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, spec || { icon: '', text: '' }]
        }));
    };

    const removeSpec = (index: number) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    const handleSpecChange = (index: number, field: 'icon' | 'text', value: string) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const handleSpecIconUpload = async (index: number, file: File | File[] | null) => {
        if (!file) {
            handleSpecChange(index, 'icon', '');
            return;
        }

        const fileToUpload = Array.isArray(file) ? file[0] : file;
        const toastId = toast.loading('Uploading spec icon...');

        try {
            const url = await fileServices.uploadFile(fileToUpload, 'cars/specs');
            handleSpecChange(index, 'icon', url);
            toast.success('Icon uploaded', { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Upload failed', { id: toastId });
        }
    };

    // Packages Handlers
    const handlePackageChange = (index: number, field: 'price' | 'isActive' | 'isAvailable', value: any) => {
        const newPackages = [...formData.packages];
        newPackages[index] = { ...newPackages[index], [field]: value };
        setFormData(prev => ({ ...prev, packages: newPackages }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.type) newErrors.type = 'Type is required';
        if (!formData.transmission) newErrors.transmission = 'Transmission is required';
        if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
        if (formData.seatingCapacity < 1) newErrors.seatingCapacity = 'Min 1 seat';
        if (formData.basePrice === '' || formData.basePrice < 0) newErrors.basePrice = 'Valid price required';
        if (formData.images.length === 0) newErrors.images = 'At least one image required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (isEditMode && initialData) {
            updateCarMutation.mutate({ id: initialData._id, data: formData });
        } else {
            createCarMutation.mutate(formData);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <CarBasicDetails
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                errors={errors}
                brands={(brandsData as any)?.brands || []}
            />

            <CarPricing
                formData={formData}
                handleChange={handleChange}
                errors={errors}
            />

            <CarMedia
                formData={formData}
                handleImageUpload={handleImageUpload}
                uploading={uploading}
                errors={errors}
            />

            <CarSpecifications
                formData={formData}
                addSpec={addSpec}
                removeSpec={removeSpec}
                handleSpecChange={handleSpecChange}
                handleSpecIconUpload={handleSpecIconUpload}
            />

            <CarPackages
                formData={formData}
                availablePackages={availablePackages}
                packagesLoading={packagesLoading}
                handlePackageChange={handlePackageChange}
            />

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="flex items-center cursor-pointer gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isEditMode ? 'Update Car' : 'Publish Car'}
                </button>
            </div>
        </form>
    );
}
