'use client';

import React, { Suspense } from 'react';
import CancellationReasonForm from '@/components/admin/cancellation-reason/CancellationReasonForm';
import { useCancellationReasonMutations } from '@/lib/hooks/mutations/useCancellationReasonMutations';
import { useCancellationReasonQueries } from '@/lib/hooks/queries/useCancellationReasonQueries';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function Content() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEditMode = !!id;

    const { useGetReasonById } = useCancellationReasonQueries();
    const { data: reason, isLoading: isFetching } = useGetReasonById(id || '');

    const { useCreateReason, useUpdateReason } = useCancellationReasonMutations();
    const createMutation = useCreateReason();
    const updateMutation = useUpdateReason();

    const handleSubmit = async (data: any) => {
        if (isEditMode && id) {
            updateMutation.mutate(
                { id, data },
                {
                    onSuccess: () => {
                        router.push('/admin/cancellation-reason/list-page');
                    }
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    router.push('/admin/cancellation-reason-management/list-page');
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
                    href="/admin/cancellation-reason-management/list-page"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Reason' : 'New Reason'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage cancellation reasons for users and admins.
                    </p>
                </div>
            </div>

            <CancellationReasonForm
                initialData={reason}
                isEditMode={isEditMode}
                isLoading={createMutation.isPending || updateMutation.isPending}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default function CancellationReasonAddPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content />
        </Suspense>
    );
}