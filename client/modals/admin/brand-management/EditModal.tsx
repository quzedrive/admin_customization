import React, { useEffect, useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import ImageField from '@/components/inputs/ImageField';
import { toast } from 'react-hot-toast';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    brand: any;
    onUpdate: (id: string, data: FormData) => void;
    isUpdating: boolean;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    onClose,
    brand,
    onUpdate,
    isUpdating
}) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        status: 1,
        logo: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (brand) {
            setFormData({
                name: brand.name,
                slug: brand.slug,
                status: brand.status,
                logo: brand.logo
            });
            setSelectedFile(null);
        }
    }, [brand]);

    if (!isOpen || !brand) return null;

    const handleFileChange = (file: File | File[] | null) => {
        if (file && !Array.isArray(file)) {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('slug', formData.slug);
        submitData.append('status', String(formData.status));

        if (selectedFile) {
            submitData.append('logo', selectedFile);
        } else if (formData.logo) {
            submitData.append('logo', formData.logo);
        }

        onUpdate(brand._id, submitData);
    };

    return (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Edit Brand</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Update brand details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="overflow-y-auto p-6 space-y-6 no-scrollbar">
                    <form id="edit-brand-form" onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-4">
                            <FloatingInput
                                id="edit-name"
                                label="Brand Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <div className="relative">
                                <FloatingInput
                                    id="edit-slug"
                                    label="Slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                    className="font-mono bg-gray-50/50"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <span className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white">Auto-generated</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Brand Logo</label>
                            <div className="p-1 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                                <ImageField
                                    label=""
                                    value={formData.logo}
                                    onChange={(val) => setFormData({ ...formData, logo: val as string })}
                                    onFileChange={handleFileChange}
                                    maxFiles={1}
                                    maxSizeMB={2}
                                />
                            </div>
                        </div>

                        <ModernDropdown
                            label="Status"
                            options={[
                                { value: '1', label: 'Active' },
                                { value: '2', label: 'Inactive' }
                            ]}
                            value={String(formData.status)}
                            onChange={(val) => setFormData({ ...formData, status: Number(val) })}
                        />
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-brand-form"
                        disabled={isUpdating}
                        className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                    >
                        {isUpdating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;