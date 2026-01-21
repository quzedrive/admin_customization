import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, History } from 'lucide-react';
import { useOrderQueries } from '@/lib/hooks/queries/useOrderQueries';

interface PriceHistoryItem {
    price: number;
    createdAt: string;
    note?: string;
    action: string;
}

interface ApproveOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (finalPrice: number) => void;
    initialPrice: number;
    isLoading?: boolean;
    orderId: string; // Added orderId
}

export default function ApproveOrderModal({
    isOpen,
    onClose,
    onConfirm,
    initialPrice,
    isLoading,
    orderId
}: ApproveOrderModalProps) {
    const [priceOption, setPriceOption] = useState<'same' | 'custom'>('same');
    const [customPrice, setCustomPrice] = useState<string>('');
    const [showGstStep, setShowGstStep] = useState(false);
    const [withGst, setWithGst] = useState(false);

    const { usePriceHistory } = useOrderQueries();
    const { data: historyData, isLoading: loadingHistory } = usePriceHistory(orderId);

    // Ensure history is an array
    const history: PriceHistoryItem[] = Array.isArray(historyData) ? historyData : [];

    useEffect(() => {
        if (isOpen) {
            setPriceOption('same');
            setCustomPrice(initialPrice.toString());
            setShowGstStep(false);
            setWithGst(false);
        }
    }, [isOpen, initialPrice]);

    const getBasePrice = () => {
        const price = priceOption === 'same' ? initialPrice : parseFloat(customPrice);
        return (isNaN(price) || price < 0) ? 0 : price;
    };

    const handleStep1Confirm = () => {
        if (getBasePrice() > 0) {
            setShowGstStep(true);
        }
    };

    const handleFinalConfirm = () => {
        let final = getBasePrice();
        if (withGst) {
            final = Math.round(final * 1.18);
        }
        onConfirm(final);
    };

    if (!isOpen) return null;

    const basePrice = getBasePrice();
    const gstAmount = Math.round(basePrice * 0.18);
    const totalPrice = withGst ? basePrice + gstAmount : basePrice;

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

                {!showGstStep ? (
                    // STEP 1: SELECT PRICE
                    <>
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

                            {/* Price History Section */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2 mb-3 text-gray-500">
                                    <History size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Price History</span>
                                </div>
                                {history.length > 0 ? (
                                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {history.map((item, idx) => {
                                            const isApproved = item.action === 'approved';
                                            const isUpdated = item.action === 'updated';

                                            return (
                                                <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-100 hover:shadow-sm transition-all">
                                                    <div>
                                                        <p className={`font-bold text-base ${isApproved ? 'text-green-700' : 'text-gray-900'}`}>
                                                            ₹{item.price.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                                            {new Date(item.createdAt).toLocaleDateString()}
                                                            <span className="mx-1">•</span>
                                                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize border ${isApproved
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : isUpdated
                                                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                                            }`}>
                                                            {item.action}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-400 font-medium">No price changes recorded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Step 1 */}
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStep1Confirm}
                                disabled={isLoading || (priceOption === 'custom' && !customPrice)}
                                className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    // STEP 2: GST OPTION
                    <>
                        <div className="p-6 space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                <p className="text-sm text-blue-800 mb-1">Base Price Selected</p>
                                <p className="text-2xl font-bold text-blue-900">₹{basePrice.toLocaleString()}</p>
                            </div>

                            <div
                                onClick={() => setWithGst(!withGst)}
                                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${withGst
                                    ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${withGst ? 'border-purple-500 bg-purple-500' : 'border-gray-400 bg-white'
                                    }`}>
                                    {withGst && <Check size={14} className="text-white" />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Add GST (18%)</p>
                                    <p className="text-sm text-gray-500">Include Goods and Services Tax in the final total.</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2 bg-gray-50 p-4 rounded-xl">
                                {withGst ? (
                                    <>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Base Price</span>
                                            <span>₹{basePrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-purple-600 font-medium">
                                            <span>GST (18%)</span>
                                            <span>+ ₹{gstAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                            <span className="font-bold text-gray-900">Total Final Price</span>
                                            <span className="font-bold text-xl text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Total Final Price</span>
                                        <span className="font-bold text-xl text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Step 2 */}
                        <div className="px-6 py-4 bg-gray-50 flex justify-between gap-3 sticky bottom-0">
                            <button
                                onClick={() => setShowGstStep(false)}
                                className="px-4 py-2 cursor-pointer text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleFinalConfirm}
                                disabled={isLoading}
                                className="px-6 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </>
                )}
            </div>
        </div>
    );
}
