import React, { useEffect, useState } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { useSiteSettingsMutations } from '@/lib/hooks/mutations/useSiteSettingsMutations';

interface ContactSettingsFormProps {
    data: any;
}

export default function ContactSettingsForm({ data }: ContactSettingsFormProps) {
    const { useUpdateContact } = useSiteSettingsMutations();
    const updateMutation = useUpdateContact();

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        mapUrl: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                mapUrl: data.mapUrl || ''
            });
        }
    }, [data]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">
                Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput
                    label="Contact Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    color='blue'
                />
                <FloatingInput
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    color='blue'
                />
                <div className="col-span-full">
                    <FloatingInput
                        label="Address"
                        type="textarea"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        color='blue'
                    />
                </div>
                <div className="col-span-full">
                    <FloatingInput
                        label="Google Maps Embed URL"
                        value={formData.mapUrl}
                        onChange={(e) => handleChange('mapUrl', e.target.value)}
                        placeholder="https://www.google.com/maps/embed?..."
                        color='blue'
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste the embed URL from Google Maps (iframe src).</p>
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
