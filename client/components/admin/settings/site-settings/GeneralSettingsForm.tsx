import React, { useEffect, useState } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import ImageField from '@/components/inputs/ImageField';
import { useSiteSettingsMutations } from '@/lib/hooks/mutations/useSiteSettingsMutations';
import { fileServices } from '@/lib/services/fileServices';
import toast from 'react-hot-toast';

interface GeneralSettingsFormProps {
    data: any;
}

export default function GeneralSettingsForm({ data }: GeneralSettingsFormProps) {
    const { useUpdateGeneral } = useSiteSettingsMutations();
    const updateMutation = useUpdateGeneral();

    const [formData, setFormData] = useState({
        siteTitle: '',
        description: '',
        keywords: '',
        lightLogo: '',
        darkLogo: '',
        favicon: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData({
                siteTitle: data.siteTitle || '',
                description: data.description || '',
                keywords: data.keywords || '',
                lightLogo: data.lightLogo || '',
                darkLogo: data.darkLogo || '',
                favicon: data.favicon || ''
            });
        }
    }, [data]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [pendingFiles, setPendingFiles] = useState<{ [key: string]: File | null }>({});
    const [uploading, setUploading] = useState(false); // Used for submit button state

    const handleFileUpload = (field: string, file: File | null) => {
        if (!file) {
            handleChange(field, '');
            setPendingFiles(prev => ({ ...prev, [field]: null }));
            return;
        }

        // Store file for later upload
        setPendingFiles(prev => ({ ...prev, [field]: file }));

        // Show local preview
        const objectUrl = URL.createObjectURL(file);
        handleChange(field, objectUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploading(true); // Re-use uploading state for UI feedback

        // Create a copy of formData to update with real URLs
        const dataToSubmit = { ...formData };

        try {
            // Process all pending file uploads
            const uploadPromises = Object.entries(pendingFiles).map(async ([field, file]) => {
                if (file) {
                    try {
                        const url = await fileServices.uploadFile(file, 'settings');
                        // Update the payload with the returned URL
                        (dataToSubmit as any)[field] = url;
                    } catch (error) {
                        console.error(`Failed to upload ${field}`, error);
                        toast.error(`Failed to upload ${field}`);
                        throw error; // Stop submission on upload failure
                    }
                }
            });

            await Promise.all(uploadPromises);

            console.log('Submitting General Settings:', dataToSubmit); // DEBUG LOG
            updateMutation.mutate(dataToSubmit, {
                onSettled: () => {
                    setLoading(false);
                    setUploading(false);
                    setPendingFiles({}); // Clear pending files on success
                }
            });
        } catch (error) {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">
                    Brand Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <FloatingInput
                            label="Site Title"
                            value={formData.siteTitle}
                            onChange={(e) => handleChange('siteTitle', e.target.value)}
                            required
                            color='blue'
                        />
                    </div>
                    <div className="col-span-full">
                        <FloatingInput
                            label="Site Description"
                            type="textarea"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            color='blue'
                        />
                        <p className="text-xs text-gray-500 mt-1">Brief description for the footer and metadata.</p>
                    </div>
                    <div className="col-span-full">
                        <FloatingInput
                            label="Keywords"
                            placeholder="e.g. ecommerce, fashion, modern"
                            value={formData.keywords}
                            onChange={(e) => handleChange('keywords', e.target.value)}
                            color='blue'
                        />
                        <p className="text-xs text-gray-500 mt-1">Comma separated keywords.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">
                    Logos & Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <ImageField
                            label="Light Logo"
                            value={formData.lightLogo}
                            onFileChange={(file) => handleFileUpload('lightLogo', file as File)}
                            helperText="Recommended height: 40px"
                        />
                    </div>
                    <div>
                        <ImageField
                            label="Dark Logo"
                            value={formData.darkLogo}
                            onFileChange={(file) => handleFileUpload('darkLogo', file as File)}
                            helperText="Recommended height: 40px"
                        />
                    </div>
                    <div>
                        <ImageField
                            label="Favicon"
                            value={formData.favicon}
                            onFileChange={(file) => handleFileUpload('favicon', file as File)}
                            helperText="Recommended size: 32x32px"
                            accept="image/x-icon,image/vnd.microsoft.icon,image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading || uploading || updateMutation.isPending}
                    className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {uploading ? 'Uploading Image...' : (loading || updateMutation.isPending ? 'Saving...' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
}
