'use client';

import { useState } from 'react';
import AdminGuard from "@/components/auth/AdminGuard";
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { cn } from '@/components/utils/cn';
import { usePathname } from 'next/navigation';
import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    // Consume query to force re-render on data update
    useAdminLoginQueries();

    const pathname = usePathname();
    const isPublicPage = pathname === '/admin/login' || pathname.startsWith('/admin/forgot-password') || pathname.startsWith('/admin/reset-password');

    return (
        <AdminGuard>
            {isPublicPage ? (
                <main className="min-h-screen bg-gray-50">
                    {children}
                </main>
            ) : (
                <div className="min-h-screen bg-gray-50 flex">
                    <Sidebar
                        isOpen={sidebarOpen}
                        isCollapsed={isDesktopCollapsed}
                        onClose={() => setSidebarOpen(false)}
                        onExpand={() => setIsDesktopCollapsed(false)}
                    />

                    <div className={cn(
                        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
                        isDesktopCollapsed ? "lg:ml-20" : "lg:ml-72"
                    )}>
                        <Header
                            onMobileMenuClick={() => setSidebarOpen(true)}
                            onDesktopMenuClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                            isDesktopCollapsed={isDesktopCollapsed}
                        />
                        <main className="flex-1 p-4 lg:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            )}
        </AdminGuard>
    );
}
