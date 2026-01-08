'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, LogOut, Settings, Shield, ExternalLink, Camera, Trash2 } from 'lucide-react';
import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';
import { useAdminLogoutMutation } from '@/lib/hooks/mutations/useAdminLogoutMutation';
import { useAdminProfileMutations } from '@/lib/hooks/mutations/useAdminProfileMutations';
import toast from 'react-hot-toast';

interface ProfileOffcanvasProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileOffcanvas({ isOpen, onClose }: ProfileOffcanvasProps) {
    const { data } = useAdminLoginQueries();
    const logoutMutation = useAdminLogoutMutation();
    const { useUpdateProfileImage, useDeleteProfileImage } = useAdminProfileMutations();
    const updateMutation = useUpdateProfileImage();
    const deleteMutation = useDeleteProfileImage();
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            await updateMutation.mutateAsync(file);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async () => {
        if (!confirm('Remove profile image?')) return;
        await deleteMutation.mutateAsync();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-70"
                    />

                    {/* Offcanvas Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[20rem] md:w-[25rem] bg-white shadow-2xl z-80 flex flex-col border-l border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-800">Admin Profile</h2>
                            <div className="flex items-center gap-1">
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-blue-600"
                                    title="View Site"
                                >
                                    <ExternalLink size={20} />
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                            {/* Profile Info */}
                            <div className="flex flex-col items-center mb-8">
                                {/* Profile Image with Camera Icon */}
                                <div className="relative group mb-4">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white overflow-hidden">
                                        {data?.admin?.profileImage ? (
                                            <img
                                                src={data.admin.profileImage}
                                                alt={data.admin.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            data?.admin?.username?.[0]?.toUpperCase() || <User size={40} />
                                        )}
                                    </div>

                                    {/* Camera Icon Overlay */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading || updateMutation.isPending}
                                        className="absolute bottom-0 right-0 cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Change profile image"
                                    >
                                        <Camera size={16} className="text-white" />
                                    </button>

                                    {/* Remove Button (only if image exists) */}
                                    {data?.admin?.profileImage && (
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleteMutation.isPending}
                                            className="absolute top-0 right-0 cursor-pointer bg-red-600 hover:bg-red-700 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                            title="Remove profile image"
                                        >
                                            <Trash2 size={14} className="text-white" />
                                        </button>
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{data?.admin?.username || 'Admin User'}</h3>
                                <p className="text-sm text-gray-500 mt-1">{data?.admin?.email || 'admin@example.com'}</p>
                                <span className="mt-3 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                                    Super Admin
                                </span>
                            </div>

                            {/* Details List */}
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-4 hover:shadow-sm transition-shadow">
                                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                                            {data?.admin?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-4 hover:shadow-sm transition-shadow">
                                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm shrink-0">
                                        <Shield size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Role</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                                            Administrator
                                        </p>
                                    </div>
                                </div>



                                {/* Placeholder for Settings */}
                                <button className="w-full p-4 rounded-xl bg-white border border-gray-200 flex items-center gap-4 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left">
                                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Account Settings</p>
                                        <p className="text-xs text-gray-400">Manage your preferences</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Footer / Logout */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Logout Confirmation Modal */}
                    <AnimatePresence>
                        {showLogoutConfirm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                            <LogOut size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Out?</h3>
                                        <p className="text-gray-500 text-sm mb-6">
                                            Are you sure you want to sign out currently logged in account?
                                        </p>
                                        <div className="flex gap-3 w-full">
                                            <button
                                                onClick={() => setShowLogoutConfirm(false)}
                                                className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => logoutMutation.mutate()}
                                                className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
