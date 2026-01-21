import React, { useState, useEffect } from 'react';
import FloatingInput from '@/components/inputs/FloatingInput';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import TipTapEditor from '@/components/text-editor/TipTapEditor';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { IPage } from '@/lib/services/pageServices';

interface PageFormProps {
    initialData?: IPage;
    onSubmit: (data: any) => void;
    isLoading: boolean;
    isEditMode?: boolean;
    onCancelUrl?: string;
}

export default function PageForm({
    initialData,
    onSubmit,
    isLoading,
    isEditMode = false,
    onCancelUrl = '/admin/pages/list-page'
}: PageFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        status: initialData?.status?.toString() || '1'
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    // Auto-generate slug from title if not editing
    useEffect(() => {
        if (!isEditMode && formData.title && !initialData) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, isEditMode, initialData]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                slug: initialData.slug,
                content: initialData.content,
                status: initialData.status.toString()
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!formData.title || !formData.slug || !formData.content) {
            return;
        }

        onSubmit({
            ...formData,
            status: parseInt(formData.status)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                        Page Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FloatingInput
                            id="title"
                            label="Page Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            color='blue'
                            error={isSubmitted && !formData.title ? 'Title is required' : ''}
                        />
                        <FloatingInput
                            id="slug"
                            label="URL Slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            color='blue'
                            disabled={isEditMode && !!initialData?.slug} // Usually lock slug on edit or make optional
                            error={isSubmitted && !formData.slug ? 'Slug is required' : ''}
                        />
                    </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                        Content Body
                    </h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Page HTML Content</label>
                        <TipTapEditor
                            label=""
                            value={formData.content}
                            onChange={(val) => setFormData({ ...formData, content: val })}
                            placeholder="Design your page content here..."
                            error={(isSubmitted && !formData.content) ? 'Content is required' : undefined}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-6">
                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                        Publishing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                            {isEditMode ? 'Updating...' : 'Saving Page'}
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            {isEditMode ? 'Update Page' : 'Save Page'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
