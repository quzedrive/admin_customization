
'use client';

import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger'
}: ConfirmationModalProps) {

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title={title}>
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-500'}`}>
                    <AlertTriangle size={32} />
                </div>

                <p className="text-gray-600">
                    {message}
                </p>

                <div className="flex items-center gap-3 w-full pt-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 cursor-pointer px-4 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 cursor-pointer px-4 py-2.5 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed ${variant === 'danger'
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                            }`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
