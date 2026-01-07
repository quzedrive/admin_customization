'use client';

import React from 'react';
import CarForm from '@/components/admin/cars-management/CarForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';

export default function EditCarPage() {
    const params = useParams();
    const id = params.id as string;

    // Fetch car data
    const { useGetCarById } = useCarQueries();
    const { data: car, isLoading, error } = useGetCarById(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-4">
                <p>Failed to load car details</p>
                <Link href="/admin/cars-management/list-page" className="text-blue-600 hover:underline">
                    Back to List
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/cars-management/list-page"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
                        <p className="text-sm text-gray-500">Update vehicle details and configuration</p>
                    </div>
                </div>
            </div>

            <CarForm initialData={car} isEditMode={true} />
        </div>
    );
}
