import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useCancellationReasonQueries } from '@/lib/hooks/queries/useCancellationReasonQueries';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reasonId: string, reasonText: string) => void;
    isLoading?: boolean;
}

export default function CancelOrderModal({ isOpen, onClose, onConfirm, isLoading }: CancelOrderModalProps) {
    const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
    const { useGetReasons } = useCancellationReasonQueries();
    const { data: reasons, isLoading: isReasonsLoading } = useGetReasons();

    const activeReasons = reasons?.filter((r: any) => r.status === 1) || [];

    const handleConfirm = () => {
        if (!selectedReasonId) return;
        const reason = activeReasons.find((r: any) => r._id === selectedReasonId);
        if (reason) {
            onConfirm(reason._id, reason.reason);
        }
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
                    className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle size={20} />
                            <h2 className="font-semibold">Cancel Order</h2>
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
                            Please select a reason for cancelling this order. This information will be recorded.
                        </p>

                        {isReasonsLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-gray-400" />
                            </div>
                        ) : activeReasons.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                No active cancellation reasons found.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {activeReasons.map((reason: any) => (
                                    <button
                                        key={reason._id}
                                        type="button"
                                        onClick={() => setSelectedReasonId(reason._id)}
                                        className={`w-full cursor-pointer text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${selectedReasonId === reason._id
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 hover:border-red-200 hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{reason.reason}</span>
                                        {selectedReasonId === reason._id && (
                                            <CheckCircle2 size={18} className="text-red-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="flex-1 cursor-pointer px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedReasonId || isLoading}
                                className="flex-1 cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isLoading && <Loader2 size={16} className="animate-spin" />}
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
