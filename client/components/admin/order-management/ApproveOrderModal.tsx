import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign } from 'lucide-react';

interface ApproveOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (finalPrice: number) => void;
    initialPrice: number;
    isLoading?: boolean;
}

export default function ApproveOrderModal({
    isOpen,
    onClose,
    onConfirm,
    initialPrice,
    isLoading
}: ApproveOrderModalProps) {
    const [priceOption, setPriceOption] = useState<'same' | 'custom'>('same');
    const [customPrice, setCustomPrice] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setPriceOption('same');
            setCustomPrice(initialPrice.toString());
        }
    }, [isOpen, initialPrice]);

    const handleConfirm = () => {
        const price = priceOption === 'same' ? initialPrice : parseFloat(customPrice);
        if (isNaN(price) || price < 0) {
            // handle validation error if needed, for now just ignore or return
            return;
        }
        onConfirm(price);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900 text-lg">Approve Order</h3>
                    <button onClick={onClose} className="p-1 cursor-pointer hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Confirm Final Price</label>

                        {/* Option: Same Price */}
                        <div
                            onClick={() => setPriceOption('same')}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${priceOption === 'same'
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${priceOption === 'same' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                                    }`}>
                                    {priceOption === 'same' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Keep Booked Price</p>
                                    <p className="text-sm text-gray-500">Use the original internal price</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900 text-lg">₹{initialPrice.toLocaleString()}</span>
                        </div>

                        {/* Option: Custom Price */}
                        <div
                            onClick={() => setPriceOption('custom')}
                            className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${priceOption === 'custom'
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${priceOption === 'custom' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                                    }`}>
                                    {priceOption === 'custom' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Change Price</p>
                                    <p className="text-sm text-gray-500">Enter a new final price</p>
                                </div>
                            </div>

                            {priceOption === 'custom' && (
                                <div className="relative animate-in slide-in-from-top-2">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        value={customPrice}
                                        onChange={(e) => setCustomPrice(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 font-medium"
                                        placeholder="0.00"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || (priceOption === 'custom' && !customPrice)}
                        className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Check size={18} />
                                Confirm Approval
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
