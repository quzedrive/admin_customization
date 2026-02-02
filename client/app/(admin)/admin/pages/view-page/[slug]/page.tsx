'use client';

import React from 'react';
import { usePageQueries } from '@/lib/hooks/queries/usePageQueries';
import { Loader2, AlertCircle, ArrowLeft, Pencil } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ViewPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { usePageBySlug } = usePageQueries();
    const { data: page, isLoading, error } = usePageBySlug(slug);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading Page Preview...</p>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-2xl mx-auto px-4 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-500 mb-6">
                    The page you are looking for could not be found or has been deleted.
                </p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Admin Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                        title="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {page.title}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {page.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                        </h1>
                        <p className="text-xs text-gray-500 font-mono">/{page.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/pages/add-page?slug=${page.slug}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                        <Pencil size={16} />
                        Edit Page
                    </Link>
                </div>
            </div>

            {/* Content Preview */}
            <div className="max-w-4xl mx-auto mt-8 px-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <article
                            className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
