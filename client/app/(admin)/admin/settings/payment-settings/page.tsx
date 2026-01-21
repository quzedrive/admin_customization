'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ManualPaymentForm from '@/components/admin/settings/payment-settings/ManualPaymentForm';
import RazorpaySettingsForm from '@/components/admin/settings/payment-settings/RazorpaySettingsForm';
import { usePaymentSettingsQueries } from '@/lib/hooks/queries/usePaymentSettingsQueries';
import { usePaymentSettingsMutations } from '@/lib/hooks/mutations/usePaymentSettingsMutations';
import StatusToggle from '@/components/inputs/ui/StatusToggle';

export default function PaymentSettingsPage() {
    const [activeTab, setActiveTab] = useState('manual');

    // Data Fetching
    const { usePaymentSettings } = usePaymentSettingsQueries();
    const { data: settings, isLoading } = usePaymentSettings();

    // Mutations
    const { useUpdatePaymentSettings, useToggleActiveMethod } = usePaymentSettingsMutations();
    const updateSettingsMutation = useUpdatePaymentSettings();
    const toggleActiveMutation = useToggleActiveMethod();

    const tabs = [
        { id: 'manual', label: 'Manual Payment (QR)', icon: QrCode },
        { id: 'razorpay', label: 'Razorpay Gateway', icon: CreditCard },
    ];

    const toggleActiveMethod = (method: number) => {
        toggleActiveMutation.mutate(method);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading payment settings...</div>;
    }

    const renderContent = () => {
        let content = null;
        switch (activeTab) {
            case 'manual':
                content = (
                    <ManualPaymentForm
                        initialData={settings?.manualPaymentDetails}
                        onSave={(data) => updateSettingsMutation.mutate({ manualPaymentDetails: data })}
                        isLoading={updateSettingsMutation.isPending}
                    />
                );
                break;
            case 'razorpay':
                content = (
                    <RazorpaySettingsForm
                        initialData={settings?.razorpayCredentials}
                        onSave={(data) => updateSettingsMutation.mutate({ razorpayCredentials: data })}
                        isLoading={updateSettingsMutation.isPending}
                    />
                );
                break;
            default:
                return null;
        }

        return (
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {content}
            </motion.div>
        );
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="py-4 flex items-center justify-between transition-all duration-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure payment methods and gateways.</p>
                </div>
            </div>

            {/* Global Active Method Selector */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 transition-all duration-300">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Active Payment Method</h3>
                    <p className="text-sm text-gray-500">Select which payment method is presented to customers.</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <span className={`flex items-center gap-2 text-sm font-medium transition-colors ${settings?.activeMethod === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                        <QrCode size={16} />
                        Manual / QR
                    </span>

                    <StatusToggle
                        status={settings?.activeMethod === 2 ? 1 : 2}
                        onToggle={() => toggleActiveMethod(settings?.activeMethod === 1 ? 2 : 1)}
                        isLoading={toggleActiveMutation.isPending}
                        color="blue"
                    />

                    <span className={`flex items-center gap-2 text-sm font-medium transition-colors ${settings?.activeMethod === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                        <CreditCard size={16} />
                        Razorpay
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar Navigation for Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-2 p-1 overflow-x-auto lg:overflow-visible sticky top-[72px] lg:top-44 bg-gray-50/95 backdrop-blur-sm z-20 no-scrollbar lg:bg-white lg:rounded-lg lg:p-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                   flex-shrink-0 cursor-pointer flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:py-3 rounded-full lg:rounded-xl text-sm font-medium transition-all whitespace-nowrap
                   ${isActive
                                        ? 'bg-blue-600 text-white shadow-md border border-transparent lg:bg-blue-50 lg:text-blue-600 lg:shadow-sm lg:border-0'
                                        : 'bg-white text-gray-600 border border-gray-200 lg:bg-transparent lg:border-0 hover:bg-gray-50 hover:text-gray-900'
                                    }
                `}
                            >
                                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-white lg:text-blue-600' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}