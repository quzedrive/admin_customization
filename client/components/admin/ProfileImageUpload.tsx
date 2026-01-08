'use client';

import React, { useState } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';
import { useAdminProfileMutations } from '@/lib/hooks/mutations/useAdminProfileMutations';
import toast from 'react-hot-toast';

export default function ProfileImageUpload() {
    const { data } = useAdminLoginQueries();
    const { useUpdateProfileImage, useDeleteProfileImage } = useAdminProfileMutations();
    const updateMutation = useUpdateProfileImage();
    const deleteMutation = useDeleteProfileImage();
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            await updateMutation.mutateAsync(file);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete your profile image?')) return;
        await deleteMutation.mutateAsync();
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h3>

            <div className="flex items-center gap-6">
                {/* Profile Image Preview */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl overflow-hidden border-4 border-white shadow-lg">
                        {data?.admin?.profileImage ? (
                            <img
                                src={data.admin.profileImage}
                                alt={data.admin.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            data?.admin?.username?.[0]?.toUpperCase() || 'A'
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg">
                        <Camera size={16} className="text-white" />
                    </div>
                </div>

                {/* Upload/Delete Buttons */}
                <div className="flex flex-col gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading || updateMutation.isPending}
                            className="hidden"
                        />
                    </label>

                    {data?.admin?.profileImage && (
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete Image'}
                        </button>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
                Recommended: Square image, at least 200x200px. Max size: 5MB
            </p>
        </div>
    );
}
