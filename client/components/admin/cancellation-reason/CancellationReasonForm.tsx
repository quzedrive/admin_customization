import React from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { Loader2 } from 'lucide-react';
import StatusToggle from '@/components/inputs/ui/StatusToggle';

interface CancellationReasonFormProps {
    initialData?: any;
    isEditMode: boolean;
    isLoading: boolean;
    onSubmit: (data: any) => void;
}

export default function CancellationReasonForm({
    initialData,
    isEditMode,
    isLoading,
    onSubmit
}: CancellationReasonFormProps) {
    const [formData, setFormData] = React.useState({
        reason: '',
        status: 1
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                reason: initialData.reason || '',
                status: initialData.status !== undefined ? initialData.status : 1
            });
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleStatusToggle = () => {
        setFormData(prev => ({ ...prev, status: prev.status === 1 ? 2 : 1 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reason */}
                    <div className="col-span-full">
                        <FloatingInput
                            label="Reason"
                            value={formData.reason}
                            onChange={(e) => handleChange('reason', e.target.value)}
                            required
                            color='blue'
                            placeholder="e.g., Changed my mind"
                        />
                    </div>

                    {/* Status */}
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                            <StatusToggle
                                status={formData.status}
                                onToggle={handleStatusToggle}
                                color='purple'
                            />
                            <span className="text-sm text-gray-600">
                                {formData.status === 1 ? 'Active (Visible)' : 'Inactive (Hidden)'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        isEditMode ? 'Update Reason' : 'Create Reason'
                    )}
                </button>
            </div>
        </form>
    );
}
