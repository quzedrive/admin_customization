'use client';

import React from 'react';
import { Menu, Bell, User, PanelLeftClose, PanelLeftOpen, Paintbrush, Palette } from 'lucide-react';
import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';
import ThemeCustomizer from './settings/appearance/ThemeCustomizer';

interface HeaderProps {
    onMobileMenuClick: () => void;
    onDesktopMenuClick: () => void;
    isDesktopCollapsed: boolean;
}

import ProfileOffcanvas from '@/modals/admin/ProfileOffcanvas';
import { useState } from 'react';

// ... imports

export default function Header({ onMobileMenuClick, onDesktopMenuClick, isDesktopCollapsed }: HeaderProps) {
    const { data } = useAdminLoginQueries();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);

    console.log(data);
    

    return (
        <>
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-60 sticky top-0 transition-all duration-300">
                {/* ... existing header content ... */}

                <div className="flex items-center gap-4">
                    <button
                        onClick={onMobileMenuClick}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <button
                        onClick={onDesktopMenuClick}
                        className="cursor-pointer hidden lg:block p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isDesktopCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                </div>

                <div className="flex items-center gap-2">

                    <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <button
                        onClick={() => setIsThemeOpen(true)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"
                        title="Customize Theme"
                    >
                        <Palette size={20} />
                    </button>

                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-gray-900">{data?.admin?.username || 'Admin'}</p>
                            <p className="text-xs text-gray-500">{data?.admin?.email}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium shadow-md overflow-hidden">
                            {data?.admin?.profileImage ? (
                                <img
                                    src={data.admin.profileImage}
                                    alt={data.admin.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                data?.admin?.username?.[0]?.toUpperCase() || <User size={20} />
                            )}
                        </div>
                    </button>
                </div>
            </header>

            <ProfileOffcanvas
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            <ThemeCustomizer
                isOpen={isThemeOpen}
                onClose={() => setIsThemeOpen(false)}
            />
        </>
    );
}
