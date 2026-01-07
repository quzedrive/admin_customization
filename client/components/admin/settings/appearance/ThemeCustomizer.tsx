'use client';

import React, { useEffect, useState } from 'react';
import { X, Check, RefreshCw, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppearanceSettingsQueries } from '@/lib/hooks/queries/useAppearanceSettingsQueries';
import { useAppearanceSettingsMutations } from '@/lib/hooks/mutations/useAppearanceSettingsMutations';

interface ThemeCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
    const { useAppearanceSettings } = useAppearanceSettingsQueries();
    const { data: settings, isLoading } = useAppearanceSettings();

    const { useUpdateAppearanceSettings } = useAppearanceSettingsMutations();
    const updateSettingsMutation = useUpdateAppearanceSettings();

    const [colors, setColors] = useState({
        primaryColor: '#2563eb',
        secondaryColor: '#4f46e5',
        iconColor: '#3b82f6',
    });

    useEffect(() => {
        if (settings) {
            setColors({
                primaryColor: settings.primaryColor || '#2563eb',
                secondaryColor: settings.secondaryColor || '#4f46e5',
                iconColor: settings.iconColor || '#3b82f6',
            });
        }
    }, [settings]);

    const handleColorChange = (key: string, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateSettingsMutation.mutate(colors, {
            onSuccess: () => {
                // Optional: Close on save or keep open
            }
        });
    };

    const handleReset = () => {
        const defaults = {
            primaryColor: '#2563eb',
            secondaryColor: '#4f46e5',
            iconColor: '#3b82f6',
        };
        setColors(defaults);
        updateSettingsMutation.mutate(defaults);
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

                    {/* Offcanvas */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] border-l border-gray-100 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Palette size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Theme Customizer</h2>
                                    <p className="text-xs text-gray-500">Personalize your admin panel</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="cursor-pointer p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Color Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Brand Colors</h3>

                                <div className="space-y-4">
                                    <ColorPicker
                                        label="Primary Color"
                                        description="Main buttons, links, and active states"
                                        value={colors.primaryColor}
                                        onChange={(val) => handleColorChange('primaryColor', val)}
                                    />
                                    <ColorPicker
                                        label="Secondary Color"
                                        description="Accents, borders, and secondary buttons"
                                        value={colors.secondaryColor}
                                        onChange={(val) => handleColorChange('secondaryColor', val)}
                                    />
                                    <ColorPicker
                                        label="Icon Color"
                                        description="Sidebar icons and general iconography"
                                        value={colors.iconColor}
                                        onChange={(val) => handleColorChange('iconColor', val)}
                                    />
                                </div>
                            </div>

                            {/* Preview Box (Optional) */}
                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase">Live Preview</h4>
                                <div className="flex gap-2">
                                    <button
                                        style={{ backgroundColor: colors.primaryColor }}
                                        className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition-transform active:scale-95"
                                    >
                                        Primary
                                    </button>
                                    <button
                                        style={{ backgroundColor: colors.secondaryColor }}
                                        className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm opacity-90"
                                    >
                                        Secondary
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                    <div
                                        style={{ backgroundColor: colors.iconColor }}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                    >
                                        <Palette size={16} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
                            <button
                                onClick={handleReset}
                                disabled={updateSettingsMutation.isPending}
                                className="flex items-center cursor-pointer gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all"
                            >
                                <RefreshCw size={16} />
                                <span>Reset</span>
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={updateSettingsMutation.isPending}
                                className="flex-1 flex items-center cursor-pointer justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {updateSettingsMutation.isPending ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Check size={18} />
                                )}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function ColorPicker({ label, description, value, onChange }: { label: string, description: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="space-y-0.5">
                <label className="text-sm font-medium text-gray-700 block">{label}</label>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div className="relative">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                />
                <div
                    className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm overflow-hidden ring-2 ring-transparent group-hover:ring-gray-100 transition-all"
                    style={{ backgroundColor: value }}
                />
            </div>
        </div>
    );
}
