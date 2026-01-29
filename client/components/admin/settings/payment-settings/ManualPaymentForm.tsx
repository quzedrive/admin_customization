import React, { useState, useEffect } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';

interface ManualPaymentFormProps {
    initialData?: {
        accountName: string;
        upiId: string;
    };
    onSave: (data: any) => void;
    isLoading: boolean;
}

export default function ManualPaymentForm({ initialData, onSave, isLoading }: ManualPaymentFormProps) {
    const [formData, setFormData] = useState({
        accountName: '',
        upiId: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                accountName: initialData.accountName || '',
                upiId: initialData.upiId || '',
            });
        }
    }, [initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-bold text-gray-900">Manual Payment Configuration</h3>
                <p className="text-sm text-gray-500 mt-1">Configure details for Name and UPI ID.</p>
            </div>

            <div className="w-full space-y-6">
                <FloatingInput
                    label="Account Holder Name"
                    value={formData.accountName}
                    onChange={(e) => handleChange('accountName', e.target.value)}
                    color='blue'
                />
                <FloatingInput
                    label="UPI ID"
                    value={formData.upiId}
                    onChange={(e) => handleChange('upiId', e.target.value)}
                    color='blue'
                />
            </div>

            <div className="flex justify-start pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100 transition-all flex items-center gap-2"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
