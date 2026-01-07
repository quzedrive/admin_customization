import React, { useEffect, useState } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import StatusToggle from '@/components/inputs/ui/StatusToggle';
import { useSiteSettingsMutations } from '@/lib/hooks/mutations/useSiteSettingsMutations';
import { AlertTriangle } from 'lucide-react';

interface MaintenanceSettingsFormProps {
    data: any;
}

export default function MaintenanceSettingsForm({ data }: MaintenanceSettingsFormProps) {
    const { useUpdateMaintenance } = useSiteSettingsMutations();
    const updateMutation = useUpdateMaintenance();

    const [formData, setFormData] = useState({
        status: 2, // 1: active, 2: inactive
        title: '',
        message: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                status: data.status || 2,
                title: data.title || '',
                message: data.message || ''
            });
        }
    }, [data]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} />
                Maintenance Mode
            </h3>

            <div className="bg-purple-50 text-purple-800 p-4 rounded-xl text-sm border border-amber-100">
                When enabled, your site will be inaccessible to public users. Only admins will be able to access the dashboard.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex items-center gap-3">
                        <StatusToggle
                            status={formData.status}
                            onToggle={() => handleChange('status', formData.status === 1 ? 2 : 1)}
                            color="purple"
                        />
                        <span className={`text-sm font-medium ${formData.status === 1 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {formData.status === 1 ? 'Maintenance Mode Active (Site Offline)' : 'Site Online'}
                        </span>
                    </div>
                </div>
                <div className="col-span-full">
                    <FloatingInput
                        label="Maintenance Title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="We will be back soon!"
                        color='blue'
                    />
                </div>
                <div className="col-span-full">
                    <FloatingInput
                        label="Maintenance Message"
                        type="textarea"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="We are undergoing scheduled maintenance..."
                        color='blue'
                    />
                </div>
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
