import React, { useEffect, useState } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import ImageField from '@/components/inputs/ImageField';
import { useSiteSettingsMutations } from '@/lib/hooks/mutations/useSiteSettingsMutations';
import { fileServices } from '@/lib/services/fileServices';
import toast from 'react-hot-toast';

interface SeoSettingsFormProps {
    data: any;
}

export default function SeoSettingsForm({ data }: SeoSettingsFormProps) {
    const { useUpdateSeo } = useSiteSettingsMutations();
    const updateMutation = useUpdateSeo();

    const [formData, setFormData] = useState({
        metaTitle: '',
        metaDescription: '',
        ogImage: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                metaTitle: data.metaTitle || '',
                metaDescription: data.metaDescription || '',
                ogImage: data.ogImage || ''
            });
        }
    }, [data]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (file: File | null) => {
        if (!file) {
            handleChange('ogImage', '');
            return;
        }

        try {
            const url = await fileServices.uploadFile(file, 'settings');
            handleChange('ogImage', url);
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload image');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">
                SEO Configuration
            </h3>
            <div className="space-y-6">
                <FloatingInput
                    label="Default Meta Title"
                    value={formData.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    color='blue'
                />
                <FloatingInput
                    label="Default Meta Description"
                    type="textarea"
                    value={formData.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    color='blue'
                />
                <div>
                    <ImageField
                        label="Default OG Image (Social Share Image)"
                        value={formData.ogImage}
                        onFileChange={(file) => handleFileUpload(file as File)} // Fixed: Correctly passes file
                        helperText="Recommended size: 1200x630px"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
