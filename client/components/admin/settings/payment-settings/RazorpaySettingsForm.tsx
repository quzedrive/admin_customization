import React, { useState, useEffect } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface RazorpaySettingsFormProps {
    initialData?: {
        keyId: string;
        keySecret: string;
    };
    onSave: (data: any) => void;
    isLoading: boolean;
}

export default function RazorpaySettingsForm({ initialData, onSave, isLoading }: RazorpaySettingsFormProps) {
    const [formData, setFormData] = useState({
        keyId: '',
        keySecret: ''
    });

    const [showSecret, setShowSecret] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                keyId: initialData.keyId || '',
                keySecret: initialData.keySecret || '',
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
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Razorpay Integration
                    <ShieldCheck size={20} className="text-green-500" />
                </h3>
                <p className="text-sm text-gray-500 mt-1">Configure your Razorpay payment gateway credentials.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm">
                    <strong>Note:</strong> You can find these keys in your Razorpay Dashboard under Settings &gt; API Keys.
                </div>

                <FloatingInput
                    label="Key ID"
                    value={formData.keyId}
                    onChange={(e) => handleChange('keyId', e.target.value)}
                    color='blue'
                    placeholder="rzp_test_..."
                />

                <div className="relative">
                    <FloatingInput
                        label="Key Secret"
                        type={showSecret ? "text" : "password"}
                        value={formData.keySecret}
                        onChange={(e) => handleChange('keySecret', e.target.value)}
                        color='blue'
                    />
                    <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100 transition-all flex items-center gap-2"
                >
                    {isLoading ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>
        </form>
    );
}
