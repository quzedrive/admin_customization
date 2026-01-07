'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ChevronDown,
    ChevronRight,
    X,
    BadgeCheck,
    List,
    PlusCircle,
    Package,
    Settings,
    Globe,
    Mails,
    CarFront,
    TicketX
} from 'lucide-react';
import { cn } from '@/components/utils/cn';
import { useAdminLogoutMutation } from '@/lib/hooks/mutations/useAdminLogoutMutation';
import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';

const menuItems = [
    {
        title: 'Overview',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' }
        ]
    },
    {
        title: 'Management',
        items: [
            {
                name: 'Brand Management',
                icon: BadgeCheck,
                href: '#',
                subItems: [
                    { name: 'All Brands', icon: List, href: '/admin/brand-management/list-page' },
                    { name: 'Add Brand', icon: PlusCircle, href: '/admin/brand-management/add-page' }
                ]
            },
            {
                name: 'Package Management',
                icon: Package,
                href: '#',
                subItems: [
                    { name: 'All Packages', icon: List, href: '/admin/package-management/list-page' },
                    { name: 'Add Package', icon: PlusCircle, href: '/admin/package-management/add-page' }
                ]
            },
            {
                name: 'Car Management',
                icon: CarFront,
                href: '#',
                subItems: [
                    { name: 'All Cars', icon: List, href: '/admin/cars-management/list-page' },
                    { name: 'Add Car', icon: PlusCircle, href: '/admin/cars-management/add-page' }
                ]
            },
            {
                name: 'Cancellation Management',
                icon: TicketX,
                href: '#',
                subItems: [
                    { name: 'All Cancellations', icon: List, href: '/admin/cancellation-reason-management/list-page' },
                    { name: 'Add Cancellation', icon: PlusCircle, href: '/admin/cancellation-reason-management/add-page' }
                ]
            },
        ]
    },
    {
        title: 'System',
        items: [
            {
                name: 'System Templates',
                icon: Mails,
                href: '#',
                subItems: [
                    { name: 'All Templates', icon: List, href: '/admin/system-templates/list-page' },
                    { name: 'Add Template', icon: PlusCircle, href: '/admin/system-templates/add-page' },
                ]
            },
            {
                name: 'Settings',
                icon: Settings,
                href: '#',
                subItems: [
                    { name: 'Site Settings', icon: Globe, href: '/admin/settings/site-settings' },
                ]
            },
        ]
    },
];

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    onExpand: () => void;
}

import { useSiteSettingsQueries } from '@/lib/hooks/queries/useSiteSettingsQueries';

// ... (existing imports)

export default function Sidebar({ isOpen, isCollapsed, onClose, onExpand }: SidebarProps) {
    const pathname = usePathname();
    const logoutMutation = useAdminLogoutMutation();
    const { data } = useAdminLoginQueries();
    const { useSiteSettings } = useSiteSettingsQueries();
    const { data: siteSettings } = useSiteSettings();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    const handleSidebarClick = () => {
        if (isCollapsed) {
            onExpand();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-60 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                onClick={handleSidebarClick}
                className={cn(
                    "fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200 z-70 overflow-y-auto no-scrollbar flex flex-col",
                    "transform transition-all duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full", // Mobile slide
                    "lg:translate-x-0", // Always visible on desktop
                    isCollapsed ? "w-20 cursor-pointer" : "w-72" // Desktop collapsible width
                )}
            >
                <div className={cn("p-6 flex items-center flex-shrink-0 transition-all duration-300", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed ? (
                        siteSettings?.general?.lightLogo ? (
                            <img src={siteSettings.general.lightLogo} alt="Logo" className="h-16 object-contain" />
                        ) : (
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                                QUZEE
                            </h1>
                        )
                    ) : (
                        siteSettings?.general?.favicon ? (
                            <img src={siteSettings.general.favicon} alt="Icon" className="h-8 w-8 object-contain" />
                        ) : (
                            <h1 className="text-xl font-bold text-blue-600">Q</h1>
                        )
                    )}
                    <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded-md">
                        <X size={20} />
                    </button>
                </div>

                <nav className="px-4 pb-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
                    {menuItems.map((section, idx) => (
                        <div key={idx}>
                            {!isCollapsed && (
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 truncate">
                                    {section.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const isDropdownOpen = openDropdown === item.name;
                                    const hasSubItems = item.subItems && item.subItems.length > 0;

                                    return (
                                        <div key={item.name}>
                                            {hasSubItems ? (
                                                <button
                                                    onClick={() => toggleDropdown(item.name)}
                                                    className={cn(
                                                        "w-full cursor-pointer flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                                                        isDropdownOpen
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                        isCollapsed && "justify-center px-0"
                                                    )}
                                                    title={isCollapsed ? item.name : undefined}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={20} />
                                                        {!isCollapsed && <span>{item.name}</span>}
                                                    </div>
                                                    {!isCollapsed && (isDropdownOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                                                        isActive
                                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                        isCollapsed && "justify-center px-0"
                                                    )}
                                                    title={isCollapsed ? item.name : undefined}
                                                >
                                                    <item.icon size={20} />
                                                    {!isCollapsed && <span>{item.name}</span>}
                                                </Link>
                                            )}

                                            {/* Dropdown Content */}
                                            <AnimatePresence>
                                                {hasSubItems && isDropdownOpen && !isCollapsed && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pl-10 pr-2 py-1 space-y-1">
                                                            {item.subItems?.map((subItem) => (
                                                                <Link
                                                                    key={subItem.name}
                                                                    href={subItem.href}
                                                                    className={cn(
                                                                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                                                        pathname === subItem.href
                                                                            ? "text-blue-600 bg-blue-50"
                                                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                                                    )}
                                                                >
                                                                    {/* Render SubItem Icon if it exists */}
                                                                    {subItem.icon && <subItem.icon size={16} />}
                                                                    <span>{subItem.name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Admin Profile Section */}
                <div className="p-4 border-t border-gray-100 mt-auto bg-white">
                    <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100", isCollapsed ? "justify-center" : "")}>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                            {data?.admin?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {data?.admin?.username || 'Admin User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {data?.admin?.email || 'admin@example.com'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
