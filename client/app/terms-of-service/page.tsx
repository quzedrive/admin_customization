'use client';

import { usePageQueries } from '@/lib/hooks/queries/usePageQueries';
import { Loader2, AlertCircle } from 'lucide-react';

export default function TermsOfServicePage() {
    const { usePageBySlug } = usePageQueries();
    // Hardcoded slug for this specific route as requested
    const { data: page, isLoading, error } = usePageBySlug('terms-of-service');

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading Terms of Service...</p>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-2xl mx-auto px-4 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service Not Found</h1>
                <p className="text-gray-500">
                    The terms of service is currently unavailable or has not been published yet.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-10">
           
            {/* Content Body */}
            <div className="max-w-7xl w-full mx-auto py-12">
                <article
                    className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
}
