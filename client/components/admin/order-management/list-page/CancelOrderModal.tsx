import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, CheckCircle2, IndianRupee, CreditCard, Wallet, Info } from 'lucide-react';
import { useCancellationReasonQueries } from '@/lib/hooks/queries/useCancellationReasonQueries';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { reasonId: string, reasonText: string, refundAmount?: number, refundMethod?: number, transactionId?: string }) => void;
    isLoading?: boolean;
    order?: any;
}

export default function CancelOrderModal({ isOpen, onClose, onConfirm, isLoading, order }: CancelOrderModalProps) {
    const [step, setStep] = useState<0 | 1>(0);
    const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
    const [refundAmount, setRefundAmount] = useState<number>(0);
    const [refundMethod, setRefundMethod] = useState<number>(1); // 1: Manual, 2: Razorpay
    const [transactionId, setTransactionId] = useState<string>('');

    const { useGetReasons } = useCancellationReasonQueries();
    const { data: reasons, isLoading: isReasonsLoading } = useGetReasons();

    const activeReasons = reasons?.filter((r: any) => r.status === 1) || [];

    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setSelectedReasonId(null);
            setTransactionId('');
            
            if (order) {
                // Try to get numerical price, or extract from package string (e.g. "144 Hours - ₹15,000")
                let total = order.finalPrice;
                
                if (!total && order.selectedPackage) {
                    const priceMatch = order.selectedPackage.match(/₹([0-9,]+)/);
                    if (priceMatch) {
                        total = parseInt(priceMatch[1].replace(/,/g, ''));
                    }
                }
                
                total = total || 0;
                
                // Calculate Refund
                let calculatedRefund = 0;
                if (order.gstAdded) {
                    // Razorpay style: Deduct 2% + 18% of that 2% (Total 2.36%)
                    // Refund = Total - (Total * 0.02 * 1.18)
                    calculatedRefund = Math.floor(total * (1 - (0.02 * 1.18)));
                } else {
                    // Full Refund if no GST added
                    calculatedRefund = total;
                }
                
                setRefundAmount(calculatedRefund);
                
                // Set default method based on how they paid
                // payment.method: 1: Manual, 2: Razorpay
                // Fallback: If method is 0 but transactionId starts with 'pay_', assume Razorpay
                const isRazorpay = order.payment?.method === 2 || 
                                  (order.payment?.transactionId?.startsWith('pay_'));
                
                setRefundMethod(isRazorpay ? 2 : 1);
            }
        }
    }, [isOpen, order]);

    const isRazorpayPayment = order?.payment?.method === 2 || order?.payment?.transactionId?.startsWith('pay_');

    const handleConfirm = () => {
        if (!selectedReasonId) return;
        const reason = activeReasons.find((r: any) => r._id === selectedReasonId);
        
        if (!reason) return;

        // If order is PAID, we must show refund step first
        if (order?.paymentStatus === 1 && step === 0) {
            setStep(1);
            return;
        }

        onConfirm({
            reasonId: reason._id,
            reasonText: reason.reason,
            refundAmount: order?.paymentStatus === 1 ? refundAmount : undefined,
            refundMethod: order?.paymentStatus === 1 ? refundMethod : undefined,
            transactionId: transactionId || undefined
        });
    };

    if (!isOpen) return null;
    
    // Calculate display total based on extracted refund amount if finalPrice is missing
    const totalPaid = order?.finalPrice || (refundAmount > 0 ? Math.ceil(refundAmount * 1.18) : 0);
    const taxHeld = totalPaid - refundAmount;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle size={20} />
                            </div>
                            <h2 className="font-bold text-lg">
                                {step === 0 ? 'Cancel Order' : 'Refund Summary'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {step === 0 ? (
                            <>
                                <p className="text-gray-600 mb-5 text-sm font-medium">
                                    Please select a reason for cancelling this order. This action will halt all ride processes.
                                </p>

                                {isReasonsLoading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="animate-spin text-red-500 w-8 h-8" />
                                    </div>
                                ) : activeReasons.length === 0 ? (
                                    <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-2xl border border-dashed">
                                        No active cancellation reasons found.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                        {activeReasons.map((reason: any) => (
                                            <button
                                                key={reason._id}
                                                type="button"
                                                onClick={() => setSelectedReasonId(reason._id)}
                                                className={`w-full cursor-pointer text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedReasonId === reason._id
                                                    ? 'border-red-500 bg-red-50/50 text-red-900 shadow-sm'
                                                    : 'border-gray-50 hover:border-red-200 hover:bg-red-50/20 text-gray-600'
                                                    }`}
                                            >
                                                <span className="text-sm font-bold">{reason.reason}</span>
                                                {selectedReasonId === reason._id && (
                                                    <div className="bg-red-500 rounded-full p-1">
                                                        <CheckCircle2 size={14} className="text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                                    <div className="flex items-start gap-3 text-blue-800 text-sm mb-4">
                                        <Info size={18} className="mt-0.5 shrink-0" />
                                        <p className="font-medium">
                                            {order?.gstAdded 
                                                ? "Order includes GST. Deducting Razorpay fees (2.36%) and refunding the balance." 
                                                : "Order is paid. Refunding the full amount as no GST was added."}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-blue-900/70">
                                            <span>Ride Charges</span>
                                            <span className="font-medium text-blue-900">₹{(order?.gstAdded ? Math.floor(totalPaid / 1.18) : totalPaid).toLocaleString()}</span>
                                        </div>
                                        {order?.gstAdded && (
                                            <div className="flex justify-between text-sm text-blue-900/70">
                                                <span>GST Charges (18%)</span>
                                                <span className="font-medium text-blue-900">₹{(totalPaid - Math.floor(totalPaid / 1.18)).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm text-blue-900 font-bold border-t border-blue-100 pt-2 pb-1">
                                            <span>Total Paid</span>
                                            <span>₹{totalPaid.toLocaleString()}</span>
                                        </div>
                                        
                                        <div className="pt-3 border-t border-blue-200 mt-2 space-y-2">
                                            <label className="text-blue-900 font-bold uppercase text-xs tracking-wider block">Refund Amount (Editable)</label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                                                <input 
                                                    type="number"
                                                    value={refundAmount}
                                                    onChange={(e) => setRefundAmount(parseInt(e.target.value) || 0)}
                                                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:border-blue-500 outline-none transition-all text-xl font-black text-blue-900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Refund Method</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            disabled={!isRazorpayPayment}
                                            onClick={() => setRefundMethod(2)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                                refundMethod === 2 
                                                ? 'border-blue-500 bg-blue-50 text-blue-900' 
                                                : !isRazorpayPayment
                                                ? 'border-gray-50 bg-gray-50/50 text-gray-300 cursor-not-allowed opacity-60'
                                                : 'border-gray-50 text-gray-400 hover:border-blue-200'
                                            }`}
                                        >
                                            <CreditCard size={20} />
                                            <span className="text-xs font-bold whitespace-nowrap">Razorpay (Auto)</span>
                                            {!isRazorpayPayment && (
                                                <span className="text-[9px] text-gray-400 font-medium">Not available for manual pay</span>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRefundMethod(1)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                                refundMethod === 1 
                                                ? 'border-blue-500 bg-blue-50 text-blue-900' 
                                                : 'border-gray-50 text-gray-400 hover:border-blue-200'
                                            }`}
                                        >
                                            <Wallet size={20} />
                                            <span className="text-xs font-bold">Manual (UPI/Cash)</span>
                                        </button>
                                    </div>
 
                                    {refundMethod === 1 && (
                                        <div className="space-y-2 pt-2">
                                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Transaction ID (Optional)</p>
                                             <div className="relative">
                                                 <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                 <input 
                                                    type="text"
                                                    placeholder="Enter refund ref ID"
                                                    value={transactionId}
                                                    onChange={(e) => setTransactionId(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                                 />
                                             </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={step === 1 ? () => setStep(0) : onClose}
                                className="flex-1 cursor-pointer px-4 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all border-2 border-transparent"
                            >
                                {step === 1 ? 'Back' : 'Keep Order'}
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedReasonId || isLoading}
                                className="flex-[1.5] cursor-pointer px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        {step === 0 ? (order?.paymentStatus === 1 && isRazorpayPayment ? 'Proceed to Refund' : 'Confirm Cancellation') : 'Process Cancellation'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
