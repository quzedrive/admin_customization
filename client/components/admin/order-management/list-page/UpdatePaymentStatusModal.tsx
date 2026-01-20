import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, X, Loader2, CheckCircle2 } from 'lucide-react';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS, PAYMENT_STATUS_DOT_COLORS } from '@/components/admin/order-management/constants';

interface UpdatePaymentStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (status: number) => void;
    currentStatus?: number;
    isLoading?: boolean;
}

export default function UpdatePaymentStatusModal({ isOpen, onClose, onConfirm, currentStatus, isLoading }: UpdatePaymentStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<number | null>(currentStatus ?? null);

    // Update selected status when modal opens or currentStatus changes
    React.useEffect(() => {
        if (isOpen && currentStatus !== undefined) {
            setSelectedStatus(currentStatus);
        }
    }, [isOpen, currentStatus]);

    const handleConfirm = () => {
        if (selectedStatus === null) return;
        onConfirm(selectedStatus);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
                        <div className="flex items-center gap-2 text-blue-600">
                            <CreditCard size={20} />
                            <h2 className="font-semibold">Update Payment Status</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 cursor-pointer hover:bg-black/5 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-600 mb-4 text-sm">
                            Select the new payment status for this order.
                        </p>

                        <div className="space-y-2">
                            {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => {
                                const statusValue = Number(value);
                                const isSelected = selectedStatus === statusValue;
                                return (
                                    <button
                                        key={statusValue}
                                        type="button"
                                        onClick={() => setSelectedStatus(statusValue)}
                                        className={`w-full cursor-pointer text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${isSelected
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${PAYMENT_STATUS_DOT_COLORS[statusValue as keyof typeof PAYMENT_STATUS_DOT_COLORS]}`} />
                                            <span className="text-sm font-medium">{label}</span>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 size={18} className="text-blue-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="flex-1 cursor-pointer px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={selectedStatus === null || selectedStatus === currentStatus || isLoading}
                                className="flex-1 cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isLoading && <Loader2 size={16} className="animate-spin" />}
                                Update Status
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
