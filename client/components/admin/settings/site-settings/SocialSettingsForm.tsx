'use client';

import React, { useEffect, useState } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { useSiteSettingsMutations } from '@/lib/hooks/mutations/useSiteSettingsMutations';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface SocialSettingsFormProps {
    data: any;
}

export default function SocialSettingsForm({ data }: SocialSettingsFormProps) {
    const { useUpdateSocial } = useSiteSettingsMutations();
    const updateMutation = useUpdateSocial();

    const [formData, setFormData] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                facebook: data.facebook || '',
                twitter: data.twitter || '',
                instagram: data.instagram || '',
                linkedin: data.linkedin || '',
                youtube: data.youtube || ''
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
                Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput
                    label="Facebook URL"
                    value={formData.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    icon={Facebook}
                    color='blue'
                />
                <FloatingInput
                    label="Twitter (X) URL"
                    value={formData.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    icon={Twitter}
                />
                <FloatingInput
                    label="Instagram URL"
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    icon={Instagram}
                />
                <FloatingInput
                    label="LinkedIn URL"
                    value={formData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    icon={Linkedin}
                />
                <FloatingInput
                    label="YouTube URL"
                    value={formData.youtube}
                    onChange={(e) => handleChange('youtube', e.target.value)}
                    icon={Youtube}
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
