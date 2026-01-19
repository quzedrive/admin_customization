import React, { useEffect, useState } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { useSiteSettingsMutations } from '@/lib/hooks/mutations/useSiteSettingsMutations';
import { useSiteSettingsQueries } from '@/lib/hooks/queries/useSiteSettingsQueries';
import { Mail, Image, Save, ShieldCheck, ShieldAlert, Server } from 'lucide-react';

export default function IntegrationsSettingsForm() {
    // Queries
    const { useEmailConfig, useImageUploadConfig } = useSiteSettingsQueries();
    const { data: emailData, isLoading: emailLoading } = useEmailConfig();
    const { data: imageData, isLoading: imageLoading } = useImageUploadConfig();

    // Mutations
    const { useUpdateEmailConfig, useUpdateImageUploadConfig } = useSiteSettingsMutations();
    const updateEmailMutation = useUpdateEmailConfig();
    const updateImageMutation = useUpdateImageUploadConfig();

    // Forms State
    const [emailForm, setEmailForm] = useState({
        apiKey: '',
        apiSecret: '',
        fromEmail: '',
        fromName: ''
    });

    const [imageForm, setImageForm] = useState({
        provider: 'cloudinary',
        cloudinary: {
            cloudName: '',
            apiKey: '',
            apiSecret: ''
        }
    });

    // Populate Forms
    useEffect(() => {
        if (emailData) {
            setEmailForm({
                apiKey: emailData.apiKey || '',
                apiSecret: emailData.apiSecret || '',
                fromEmail: emailData.fromEmail || '',
                fromName: emailData.fromName || ''
            });
        }
    }, [emailData]);

    useEffect(() => {
        if (imageData) {
            setImageForm({
                provider: imageData.provider || 'cloudinary',
                cloudinary: {
                    cloudName: imageData.cloudinary?.cloudName || '',
                    apiKey: imageData.cloudinary?.apiKey || '',
                    apiSecret: imageData.cloudinary?.apiSecret || ''
                }
            });
        }
    }, [imageData]);

    // Handlers
    const handleEmailChange = (field: string, value: any) => {
        setEmailForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (section: string, field: string, value: any) => {
        if (section === 'root') {
            setImageForm(prev => ({ ...prev, [field]: value }));
        } else if (section === 'cloudinary') {
            setImageForm(prev => ({
                ...prev,
                cloudinary: { ...prev.cloudinary, [field]: value }
            }));
        }
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateEmailMutation.mutate(emailForm);
    };

    const handleImageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateImageMutation.mutate(imageForm);
    };

    if (emailLoading || imageLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Email Configuration */}
            <form onSubmit={handleEmailSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email Configuration (Mailjet)</h3>
                        <p className="text-sm text-gray-500">Configure your Mailjet API credentials for sending emails.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <FloatingInput
                            label="API Key"
                            value={emailForm.apiKey}
                            onChange={(e) => handleEmailChange('apiKey', e.target.value)}
                            color='blue'
                        />
                    </div>
                    <div className="col-span-1">
                        <FloatingInput
                            label="API Secret"
                            type="password"
                            value={emailForm.apiSecret}
                            onChange={(e) => handleEmailChange('apiSecret', e.target.value)}
                            color='blue'
                        />
                    </div>

                    <div className="col-span-full border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Sender Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput
                                label="From Email"
                                type="email"
                                value={emailForm.fromEmail}
                                onChange={(e) => handleEmailChange('fromEmail', e.target.value)}
                                placeholder="noreply@example.com"
                                color='blue'
                            />
                            <FloatingInput
                                label="From Name"
                                value={emailForm.fromName}
                                onChange={(e) => handleEmailChange('fromName', e.target.value)}
                                placeholder="My Website"
                                color='blue'
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={updateEmailMutation.isPending}
                        className="cursor-pointer px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {updateEmailMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        <span>Save Email Settings</span>
                    </button>
                </div>
            </form>

            {/* Image Upload Configuration */}
            <form onSubmit={handleImageSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Image size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Image Storage (Cloudinary)</h3>
                        <p className="text-sm text-gray-500">Configure where your uploaded images are stored.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Provider Selection (Hidden if only one option) */}
                    <div className="hidden">
                        <label className="text-sm font-medium text-gray-700">Storage Provider</label>
                        <select
                            value={imageForm.provider}
                            onChange={(e) => handleImageChange('root', 'provider', e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="cloudinary">Cloudinary</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-full">
                            <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                                <Server size={16} />
                                <span>Get these credentials from your Cloudinary Dashboard.</span>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <FloatingInput
                                label="Cloud Name"
                                value={imageForm.cloudinary.cloudName}
                                onChange={(e) => handleImageChange('cloudinary', 'cloudName', e.target.value)}
                                color='blue'
                            />
                        </div>
                        <div className="col-span-1">
                            <FloatingInput
                                label="API Key"
                                value={imageForm.cloudinary.apiKey}
                                onChange={(e) => handleImageChange('cloudinary', 'apiKey', e.target.value)}
                                color='blue'
                            />
                        </div>
                        <div className="col-span-1">
                            <FloatingInput
                                label="API Secret"
                                type="password"
                                value={imageForm.cloudinary.apiSecret}
                                onChange={(e) => handleImageChange('cloudinary', 'apiSecret', e.target.value)}
                                color='blue'
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={updateImageMutation.isPending}
                        className="cursor-pointer px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {updateImageMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        <span>Save Storage Settings</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
