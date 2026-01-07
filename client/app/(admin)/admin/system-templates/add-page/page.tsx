'use client';

import React, { Suspense } from 'react';
import SystemTemplateForm from '@/components/admin/system-templates/SystemTemplateForm';
import { useSystemTemplateMutations } from '@/lib/hooks/mutations/useSystemTemplateMutations';
import { useSystemTemplateQueries } from '@/lib/hooks/queries/useSystemTemplateQueries';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function Content() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEditMode = !!id;

    const { useGetTemplateById } = useSystemTemplateQueries();
    const { data: template, isLoading: isFetching } = useGetTemplateById(id || '');

    const { createTemplateMutation, updateTemplateMutation } = useSystemTemplateMutations();

    const handleSubmit = async (data: any) => {
        if (isEditMode && id) {
            updateTemplateMutation.mutate(
                { id, data },
                {
                    onSuccess: () => {
                        router.push('/admin/system-templates/list-page');
                    }
                }
            );
        } else {
            createTemplateMutation.mutate(data, {
                onSuccess: () => {
                    router.push('/admin/system-templates/list-page');
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
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/system-templates/list-page"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Template' : 'New Template'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Configure automated messages for system events.
                    </p>
                </div>
            </div>

            <SystemTemplateForm
                initialData={template}
                isEditMode={isEditMode}
                isLoading={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default function SystemTemplateAddPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content />
        </Suspense>
    );
}