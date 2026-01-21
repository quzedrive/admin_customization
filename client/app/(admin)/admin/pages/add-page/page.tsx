'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePageQueries } from '@/lib/hooks/queries/usePageQueries';
import { usePageMutations } from '@/lib/hooks/mutations/usePageMutations';
import PageForm from '@/components/admin/pages/PageForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function Content() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');
    const isEditMode = !!slug;

    const { useAdminPageBySlug } = usePageQueries();

    // Fetch data if editing
    // The query is enabled only if in edit mode and a slug is present (handled inside the hook)
    const { data: existingPage, isLoading: isFetching } = useAdminPageBySlug(slug || '');

    const { createPage, updatePage } = usePageMutations();

    const handleSubmit = async (data: any) => {
        if (isEditMode && existingPage?._id) {
            updatePage.mutate(
                { id: existingPage._id, data },
                {
                    onSuccess: () => {
                        router.push('/admin/pages/list-page');
                    }
                }
            );
        } else {
            createPage.mutate(data, {
                onSuccess: () => {
                    router.push('/admin/pages/list-page');
                }
            });
        }
    };

    if (isEditMode && isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/pages/list-page"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Page' : 'New Page'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Create or update static content pages.
                    </p>
                </div>
            </div>

            <PageForm
                initialData={existingPage}
                isEditMode={isEditMode}
                isLoading={createPage.isPending || updatePage.isPending}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default function AddPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content />
        </Suspense>
    );
}
