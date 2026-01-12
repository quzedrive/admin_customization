'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRootPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/dashboard');
    }, [router]);

    return (
        <div className="flex bg-gray-50 h-screen w-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
}
