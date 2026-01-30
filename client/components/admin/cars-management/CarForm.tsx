
'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save, Trash2 } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useRouter } from 'next/navigation';
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
import CarHostDetails from './form-sections/CarHostDetails';

import CarVehicleDetails from './form-sections/CarVehicleDetails';

interface CarFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function CarForm({ initialData, isEditMode = false }: CarFormProps) {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState<CarFormData>({
        brand: '',
        name: '',
        slug: '',
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
        vehicleModel: '',
        registrationNumber: '',
        engineNumber: '',
        chassisNumber: '',
        registrationType: '',

        packages: [],
        host: { type: 1, details: { name: '', email: '', phone: '', aadhar: '' } },
        status: 1
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    // Slug Generator
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    // Fetch Packages
    const { useAdminPackages } = usePackageQueries();
    const { data: packagesData, isLoading: packagesLoading } = useAdminPackages({ page: 1, limit: 100, search: '', status: 1 });

    // Fetch Brands
    // Fetch Brands
    const { usePublicBrands } = useBrandQueries();
    const { data: brandsData, isLoading: brandsLoading } = usePublicBrands({ page: 1, limit: 100, search: '' });


    const { createCarMutation, updateCarMutation, deleteCarMutation } = useCarMutations();
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
                slug: initialData.slug || '',
                type: initialData.type || '',
                transmission: initialData.transmission || '',
                fuelType: initialData.fuelType || '',
                seatingCapacity: initialData.seatingCapacity || 4,
                basePrice: initialData.basePrice || '',
                hourlyCharge: initialData.hourlyCharge || '',
                additionalHourlyCharge: initialData.additionalHourlyCharge || '',
                description: initialData.description || '',
                images: imageUrls,
                specifications: specs,
                vehicleModel: initialData.vehicleModel || '',
                registrationNumber: initialData.registrationNumber || '',
                engineNumber: initialData.engineNumber || '',
                chassisNumber: initialData.chassisNumber || '',
                registrationType: initialData.registrationType || '',
                packages: [], // Handled separately
                host: initialData.host || { type: 1, details: { name: '', email: '', phone: '', aadhar: '' } },
                status: initialData.status ?? 1
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
                    existingMap.set(p.package._id, {
                        price: p.price,
                        discountPrice: p.discountPrice,
                        halfDayPrice: p.halfDayPrice,
                        isActive: p.isActive,
                        isAvailable: p.isAvailable,
                        _id: p._id
                    });
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
                        discountPrice: existing?.discountPrice ?? '',
                        halfDayPrice: existing?.halfDayPrice ?? '',
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

        // Auto-generate slug if name changes and not manually edited
        if (name === 'name' && !isSlugManuallyEdited) {
            setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
        }

        // If manual slug edit, mark as manually edited
        if (name === 'slug') {
            setIsSlugManuallyEdited(true);
        }

        // Clear error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleStatusChange = (value: number) => {
        setFormData(prev => ({ ...prev, status: value }));
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

    const handleImageChange = (newImages: any) => {
        setFormData(prev => ({ ...prev, images: newImages || [] }));
        if (errors.images && (newImages || []).length > 0) {
            setErrors(prev => ({ ...prev, images: '' }));
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
        setFormData(prev => {
            const newSpecs = [...prev.specifications];
            newSpecs[index] = { ...newSpecs[index], [field]: value };
            return { ...prev, specifications: newSpecs };
        });
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
    const handlePackageChange = (index: number, field: 'price' | 'discountPrice' | 'halfDayPrice' | 'isActive', value: any) => {
        const newPackages = [...formData.packages];
        newPackages[index] = { ...newPackages[index], [field]: value };
        setFormData(prev => ({ ...prev, packages: newPackages }));
    };

    const handleHostChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            host: {
                ...prev.host,
                [field]: value
            }
        }));
    };

    const handleHostDetailsChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            host: {
                ...prev.host,
                details: {
                    ...prev.host.details!,
                    [field]: value
                }
            }
        }));
        // Clear error directly since we key errors by direct field names like 'hostName' for simplicity in UI component
        // In validate() we map these errors back
        const errorKey = field === 'name' ? 'hostName' : field === 'email' ? 'hostEmail' : field === 'phone' ? 'hostPhone' : '';
        if (errorKey && errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }));
        }
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

        if (formData.host.type === 2) {
            if (!formData.host.details?.name) newErrors.hostName = 'Host Name is required';
            if (!formData.host.details?.email) newErrors.hostEmail = 'Host Email is required';
            if (!formData.host.details?.phone) newErrors.hostPhone = 'Host Phone is required';
        }

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
            updateCarMutation.mutate({ id: initialData._id, data: { ...formData, status: formData.status } });
        } else {
            createCarMutation.mutate({ ...formData, activeStatus: formData.status });
        }
    };

    const handleDelete = () => {
        if (initialData?._id) {
            deleteCarMutation.mutate(initialData._id, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    router.push('/admin/cars-management/list-page');
                }
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <CarBasicDetails
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleStatusChange={handleStatusChange}
                errors={errors}
                brands={(brandsData as any)?.brands || []}
            />

            <CarVehicleDetails
                formData={formData}
                handleChange={handleChange}
                errors={errors}
            />

            <CarPricing
                formData={formData}
                handleChange={handleChange}
                errors={errors}
            />

            <CarMedia
                formData={formData}
                handleImageUpload={handleImageUpload}
                handleImageChange={handleImageChange}
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

            <CarHostDetails
                formData={formData}
                handleChange={handleChange}
                handleHostChange={handleHostChange}
                handleHostDetailsChange={handleHostDetailsChange}
                errors={errors}
            />

            <CarPackages
                formData={formData}
                availablePackages={availablePackages}
                packagesLoading={packagesLoading}
                handlePackageChange={handlePackageChange}
            />

            {/* Submit Button */}
            <div className={`flex ${isEditMode ? 'justify-between' : 'justify-end'} pt-4`}>
                {isEditMode && (
                    <button
                        type="button"
                        onClick={() => setDeleteModalOpen(true)}
                        className="flex items-center cursor-pointer gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all font-medium"
                    >
                        <Trash2 size={20} />
                        Delete Car
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="flex items-center cursor-pointer gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isEditMode ? 'Update Car' : 'Publish Car'}
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Car"
                message="Are you sure you want to delete this car? This action will hide it from the platform."
                isLoading={deleteCarMutation.isPending}
            />
        </form>
    );
}
