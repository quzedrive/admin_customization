
import React from 'react';
import Modal from '@/components/ui/Modal';
import { UserCheck, Mail, Phone, CreditCard } from 'lucide-react';

interface HostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    hostDetails: any;
}

export default function HostDetailsModal({
    isOpen,
    onClose,
    hostDetails
}: HostDetailsModalProps) {
    if (!hostDetails) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" title="Host Details">
            <div className="pt-2 pb-6 px-2">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3 ring-4 ring-white shadow-sm">
                            <UserCheck size={32} strokeWidth={1.5} />
                        </div>
                        <div className="absolute bottom-2 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="sr-only">Active</span>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{hostDetails.name}</h3>
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1">
                        Attached Host
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors group">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                                <Mail size={16} />
                            </div>
                            <div className="overflow-hidden">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Email</label>
                                <p className="text-sm font-medium text-gray-900 truncate">{hostDetails.email}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors group">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400 group-hover:text-green-500 transition-colors">
                                <Phone size={16} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Phone</label>
                                <p className="text-sm font-medium text-gray-900">{hostDetails.phone}</p>
                            </div>
                        </div>

                        {hostDetails.aadhar && (
                            <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors group">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400 group-hover:text-purple-500 transition-colors">
                                    <CreditCard size={16} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Aadhar</label>
                                    <p className="text-sm font-medium text-gray-900 font-mono tracking-wide">{hostDetails.aadhar}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full cursor-pointer py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
