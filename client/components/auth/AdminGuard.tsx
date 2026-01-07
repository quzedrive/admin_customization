'use client';

import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '@/redux/slices/authSlice';
import client from '@/lib/api/client';
import { useAdminLogoutMutation } from '@/lib/hooks/mutations/useAdminLogoutMutation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { data, isLoading, isError, isSuccess } = useAdminLoginQueries();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isSuccess && data?.admin) {
            // If already logged in:
            // If accessing login page, redirect to dashboard
            // If accessing login page or public auth pages, redirect to dashboard
            if (pathname === '/admin/login' || pathname.startsWith('/admin/forgot-password') || pathname.startsWith('/admin/reset-password')) {
                router.push('/admin/dashboard');
            }
            // Usually the query doesn't return access token, but if it did we'd set it.
            // Assuming the query relies on cookie or already set token.
            // If we lost token state in Redux but cookie works, we are fine.
        } else if (isError) {
            // If not logged in or error:
            // If accessing protected route, redirect to login
            // If accessing protected route, redirect to login
            if (pathname !== '/admin/login' && !pathname.startsWith('/admin/forgot-password') && !pathname.startsWith('/admin/reset-password')) {
                router.push('/admin/login');
            }
        }
    }, [isSuccess, isError, data, router, pathname]);


    const [isLongLoading, setIsLongLoading] = useState(false);
    const logoutMutation = useAdminLogoutMutation();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLoading) {
            timer = setTimeout(() => setIsLongLoading(true), 5000); // 5s timeout
        } else {
            setIsLongLoading(false);
        }
        return () => clearTimeout(timer);
    }, [isLoading]);

    // Determine if we should show the loader
    // 1. Still loading initial auth state
    // 2. Authenticated but still on login page (will be redirected by useEffect)
    // 3. Not authenticated but on protected page (will be redirected by useEffect)
    const isPublicPage = pathname === '/admin/login' || pathname.startsWith('/admin/forgot-password') || pathname.startsWith('/admin/reset-password');

    const isRedirecting = (isSuccess && data?.admin && isPublicPage) ||
        (isError && !isPublicPage);

    const showLoader = isLoading || isRedirecting;

    if (showLoader) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium animate-pulse">
                        {isLoading ? 'Checking authentication...' :
                            (isSuccess && data?.admin) ? 'Authenticating...' : 'Redirecting...'}
                    </p>
                </div>

                {isLongLoading && (
                    <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500 mt-4">
                        <p className="text-gray-500 text-sm">Loading is taking longer than expected...</p>
                        <button
                            onClick={() => logoutMutation.mutate()}
                            className="text-red-600 text-sm hover:underline font-medium"
                        >
                            Force Logout
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return <>{children}</>;
}
