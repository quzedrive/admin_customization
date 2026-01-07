'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePackageMutations } from '@/lib/hooks/mutations/usePackageMutations';
import { usePackageQueries } from '@/lib/hooks/queries/usePackageQueries';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PackageForm from '@/components/admin/package-management/PackageForm';

export default function AddPackagePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEditMode = !!id;

    const { useCreatePackage, useUpdatePackage } = usePackageMutations();
    const createMutation = useCreatePackage();
    const updateMutation = useUpdatePackage();

    const { usePackageById } = usePackageQueries();
    const { data: packageData, isLoading: isFetching } = usePackageById(id);

    const handleSubmit = (data: any) => {
        if (isEditMode && id) {
            updateMutation.mutate({ id, data }, {
                onSuccess: () => router.push('/admin/package-management/list-page')
            });
        } else {
            createMutation.mutate(data, {
                onSuccess: () => router.push('/admin/package-management/list-page')
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/package-management/list-page"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Package' : 'Add New Package'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {isEditMode ? 'Update package details' : 'Create a new package plan'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <PackageForm
                    initialData={packageData}
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending || updateMutation.isPending || (isEditMode && isFetching)}
                    isEditMode={isEditMode}
                    onCancelUrl="/admin/package-management/list-page"
                />
            </div>
        </div>
    );
}