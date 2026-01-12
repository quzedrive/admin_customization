
import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, Edit2, X } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import ImageField from '@/components/inputs/ImageField';
import { CarFormData } from '../types';
import { fileServices } from '@/lib/services/fileServices';
import { toast } from 'react-hot-toast';

interface CarSpecificationsProps {
    formData: CarFormData;
    addSpec: (spec?: { icon: string; text: string }) => void;
    removeSpec: (index: number) => void;
    handleSpecChange: (index: number, field: 'icon' | 'text', value: string) => void;
    handleSpecIconUpload: (index: number, file: File | File[] | null) => void;
}

export default function CarSpecifications({
    formData,
    addSpec,
    removeSpec,
    handleSpecChange,
    handleSpecIconUpload
}: CarSpecificationsProps) {
    const [tempSpec, setTempSpec] = useState({ icon: '', text: '' });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    // Handle upload for the temporary/new spec
    const handleTempIconUpload = async (file: File | File[] | null) => {
        console.log('handleTempIconUpload called', file);
        if (!file) {
            console.log('No file provided, clearing icon');
            setTempSpec(prev => ({ ...prev, icon: '' }));
            return;
        }

        const fileToUpload = Array.isArray(file) ? file[0] : file;
        setUploading(true);
        const toastId = toast.loading('Uploading icon...');

        try {
            console.log('Starting upload for file:', fileToUpload.name);
            const url = await fileServices.uploadFile(fileToUpload, 'cars/specs');
            console.log('Upload successful, URL:', url);
            setTempSpec(prev => ({ ...prev, icon: url }));
            toast.success('Icon uploaded', { id: toastId });
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed', { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = () => {
        if (!tempSpec.text.trim()) {
            toast.error('Please enter a feature text');
            return;
        }

        addSpec(tempSpec);
        setTempSpec({ icon: '', text: '' });
        toast.success('Specification added');
    };

    const handleUpdate = () => {
        if (editingIndex === null) return;

        handleSpecChange(editingIndex, 'icon', tempSpec.icon);
        handleSpecChange(editingIndex, 'text', tempSpec.text);

        setEditingIndex(null);
        setTempSpec({ icon: '', text: '' });
        toast.success('Specification updated');
    };

    const startEdit = (index: number) => {
        const spec = formData.specifications[index];
        setTempSpec({ icon: spec.icon, text: spec.text });
        setEditingIndex(index);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setTempSpec({ icon: '', text: '' });
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <Settings size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Specifications</h2>
                    <p className="text-sm text-gray-500">Key features and specs (e.g., 'GPS', 'Bluetooth')</p>
                </div>
            </div>

            {/* Add/Edit Form Area */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200/60">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 block">
                    {editingIndex !== null ? 'Edit Specification' : 'Add New Specification'}
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-64">
                        <ImageField
                            value={tempSpec.icon}
                            onChange={(val) => !val && setTempSpec(prev => ({ ...prev, icon: '' }))}
                            onFileChange={handleTempIconUpload}
                            multiple={false}
                            disabled={uploading}
                        />
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                        <FloatingInput
                            label="Feature"
                            placeholder="e.g. Leather Seats"
                            value={tempSpec.text}
                            onChange={(e) => setTempSpec(prev => ({ ...prev, text: e.target.value }))}
                            className="bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        {editingIndex !== null ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={uploading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <Save size={16} /> Update
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    <X size={16} /> Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAdd}
                                disabled={uploading}
                                className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium shadow-sm"
                            >
                                <Plus size={16} /> Add
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* List of Added Specs */}
            {formData.specifications.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">
                        Added Specifications ({formData.specifications.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {formData.specifications.map((spec, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 p-3 bg-white rounded-xl border transition-all group ${editingIndex === index ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-gray-200 shadow-sm hover:border-blue-200'}`}
                            >
                                <div className="shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                                    {spec.icon ? (
                                        <img src={spec.icon} alt="" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <Settings size={16} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{spec.text}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(index)}
                                        className="cursor-pointer p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        disabled={editingIndex !== null}
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeSpec(index)}
                                        className="cursor-pointer p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        disabled={editingIndex !== null}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {formData.specifications.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                    No specifications added yet. Add some above!
                </div>
            )}
        </div>
    );
}
