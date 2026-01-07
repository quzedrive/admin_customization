import React, { useState, useEffect } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import TipTapEditor from '@/components/text-editor/TipTapEditor';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SystemTemplateFormProps {
    initialData?: {
        name: string;
        slug: string;
        smsContent: string;
        pushBody: string;
        emailSubject: string;
        emailContent: string;
        status: number;
    };
    onSubmit: (data: any) => void;
    isLoading: boolean;
    isEditMode?: boolean;
    onCancelUrl?: string; // Optional now
}

export default function SystemTemplateForm({
    initialData,
    onSubmit,
    isLoading,
    isEditMode = false,
    onCancelUrl = '/admin/system-templates/list-page'
}: SystemTemplateFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        smsContent: initialData?.smsContent || '',
        pushBody: initialData?.pushBody || '',
        emailSubject: initialData?.emailSubject || '',
        emailContent: initialData?.emailContent || '',
        status: initialData?.status?.toString() || '1'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                slug: initialData.slug,
                smsContent: initialData.smsContent || '',
                pushBody: initialData.pushBody || '',
                emailSubject: initialData.emailSubject || '',
                emailContent: initialData.emailContent || '',
                status: initialData.status.toString()
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            status: parseInt(formData.status)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FloatingInput
                            id="name"
                            label="Template Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            color='blue'
                        />
                        <FloatingInput
                            id="slug"
                            label="Unique Slug (Identifier)"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            color='blue'
                            disabled={isEditMode} // Usually slug shouldn't change, or be careful
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <span className="w-1 h-5 bg-green-500 rounded-full"></span> SMS
                        </h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">SMS Content</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent min-h-[100px]"
                                value={formData.smsContent}
                                onChange={(e) => setFormData({ ...formData, smsContent: e.target.value })}
                                placeholder="Enter SMS content..."
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                            <span className="w-1 h-5 bg-purple-500 rounded-full"></span> Push Notification
                        </h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Push Notification Body</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent min-h-[100px]"
                                value={formData.pushBody}
                                onChange={(e) => setFormData({ ...formData, pushBody: e.target.value })}
                                placeholder="Enter Push Notification body..."
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span> Email Configuration
                    </h3>
                    <FloatingInput
                        id="emailSubject"
                        label="Email Subject"
                        value={formData.emailSubject}
                        onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
                        required
                        color='blue'
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Email Content</label>
                        <TipTapEditor
                            label=""
                            value={formData.emailContent}
                            onChange={(val) => setFormData({ ...formData, emailContent: val })}
                            placeholder="Design your email template here..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <ModernDropdown
                        label="Status"
                        options={[
                            { value: '1', label: 'Active' },
                            { value: '2', label: 'Inactive' }
                        ]}
                        value={formData.status}
                        onChange={(val) => setFormData({ ...formData, status: val })}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <Link
                    href={onCancelUrl}
                    className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} transition-all shadow-sm hover:shadow`}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isEditMode ? 'Updating...' : 'Saving Template'}
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            {isEditMode ? 'Update Template' : 'Save Template'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
