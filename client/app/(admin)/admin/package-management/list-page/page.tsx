'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePackageQueries } from '@/lib/hooks/queries/usePackageQueries';
import { usePackageMutations } from '@/lib/hooks/mutations/usePackageMutations';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    LayoutList,
    LayoutGrid,
    ListFilter,
    Package as PackageIcon,
    Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import DeleteModal from '@/modals/admin/brand-management/DeleteModal';
import StatusToggle from '@/components/inputs/ui/StatusToggle';

export default function PackageListPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // Queries & Mutations
    const { useAdminPackages } = usePackageQueries();
    const { useDeletePackage, useUpdatePackage } = usePackageMutations();

    // Data Fetching
    const { data, isLoading } = useAdminPackages({
        page,
        limit,
        search,
        status: statusFilter ? Number(statusFilter) : undefined
    });

    const deleteMutation = useDeletePackage();
    const updateMutation = useUpdatePackage();

    // Handlers
    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId, {
                onSuccess: () => {
                    setDeleteId(null);
                }
            });
        }
    };

    const handleStatusToggle = (pkg: any) => {
        const newStatus = pkg.status === 1 ? 2 : 1;
        setTogglingId(pkg._id);

        const formData = new FormData();
        formData.append('status', newStatus.toString());

        updateMutation.mutate(
            { id: pkg._id, data: formData },
            {
                onSuccess: () => {
                    setTogglingId(null);
                },
                onError: () => {
                    setTogglingId(null);
                }
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
                    <p className="text-gray-500 text-sm">Manage subscription packages</p>
                </div>
                <Link
                    href="/admin/package-management/add-page"
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <Plus size={18} />
                    Add Package
                </Link>
            </div>

            {/* Filters & Controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Search & Status Filter */}
                <div className="flex flex-1 gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search packages..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <div className="w-40">
                        <ModernDropdown
                            options={[
                                { value: '', label: 'All Status' },
                                { value: '1', label: 'Active' },
                                { value: '2', label: 'Inactive' }
                            ]}
                            value={statusFilter}
                            onChange={(val) => {
                                setStatusFilter(val);
                                setPage(1);
                            }}
                            placeholder="Status"
                        />
                    </div>
                </div>

                {/* View Options */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`cursor-pointer p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            title="Table View"
                        >
                            <LayoutList size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`cursor-pointer p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    <div className="w-48">
                        <ModernDropdown
                            icon={ListFilter}
                            options={[
                                { value: '10', label: '10 per page' },
                                { value: '15', label: '15 per page' },
                                { value: '20', label: '20 per page' }
                            ]}
                            value={String(limit)}
                            onChange={(val) => {
                                setLimit(Number(val));
                                setPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {viewMode === 'table' ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Package Name</th>
                                        <th className="px-6 py-4">Time Duration</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Created At</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 size={24} className="animate-spin text-blue-500" />
                                                    <p>Loading packages...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : data?.packages?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <p className="text-lg font-medium text-gray-900 mb-1">No packages found</p>
                                                <p>Try adjusting your search or filters</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        data?.packages?.map((pkg: any) => (
                                            <tr key={pkg._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                        {pkg.image ? (
                                                            <Image
                                                                src={pkg.image}
                                                                alt={pkg.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="40px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <PackageIcon size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {pkg.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {pkg.time}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pkg.status === 1
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {pkg.status === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {format(new Date(pkg.createdAt), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <StatusToggle
                                                            status={pkg.status}
                                                            onToggle={() => handleStatusToggle(pkg)}
                                                            isLoading={togglingId === pkg._id}
                                                            color='purple'
                                                        />
                                                        <div className="h-4 w-px bg-gray-200"></div>
                                                        <Link
                                                            href={`/admin/package-management/add-page?id=${pkg._id}`}
                                                            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(pkg._id)}
                                                            className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination for Table */}
                        {data?.pagination && data.pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
                                <p className="text-sm text-gray-500">
                                    Page <span className="font-medium">{page}</span> of <span className="font-medium">{data.pagination.totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                                        disabled={page === data.pagination.totalPages}
                                        className="cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    /* Grid View */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {isLoading ? (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    <Loader2 size={24} className="animate-spin text-blue-500 mx-auto mb-2" />
                                    <p>Loading packages...</p>
                                </div>
                            ) : data?.packages?.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                                    <p className="text-lg font-medium text-gray-900 mb-1">No packages found</p>
                                    <p>Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                data?.packages?.map((pkg: any) => (
                                    <div key={pkg._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 group relative flex flex-col items-center">

                                        {/* Status Badge - Absolute Top Right */}
                                        <div className="absolute top-2 right-4 z-10">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${pkg.status === 1
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {pkg.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {/* Card Header: Icon Left, Info Right */}
                                        <div className="flex items-center w-full gap-4 mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner relative">
                                                {pkg.image ? (
                                                    <Image
                                                        src={pkg.image}
                                                        alt={pkg.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                ) : (
                                                    <PackageIcon size={32} className="text-blue-500" />
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start min-w-0 flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate w-full tracking-tight text-left" title={pkg.name}>{pkg.name}</h3>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 rounded-lg w-full truncate text-left">
                                                    <Clock size={12} />
                                                    <span>{pkg.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer: Date & Actions */}
                                        <div className="w-full flex items-center justify-between relative pt-4 border-t border-gray-100 mt-auto">
                                            <div className="text-xs font-medium text-gray-400">
                                                {format(new Date(pkg.createdAt), 'MMM d, yyyy')}
                                            </div>

                                            {/* Actions - Bottom Right */}
                                            <div className=" flex gap-3 items-center">
                                                <StatusToggle
                                                    status={pkg.status}
                                                    onToggle={() => handleStatusToggle(pkg)}
                                                    isLoading={togglingId === pkg._id}
                                                    color='purple'
                                                />
                                                <div className="h-4 w-px bg-gray-200"></div>
                                                <Link
                                                    href={`/admin/package-management/add-page?id=${pkg._id}`}
                                                    className="cursor-pointer p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(pkg._id)}
                                                    className="cursor-pointer p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination for Grid */}
                        {data?.pagination && data.pagination.totalPages > 1 && (
                            <div className="bg-white px-6 py-4 border border-gray-200 rounded-xl flex items-center justify-between shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Page <span className="font-medium">{page}</span> of <span className="font-medium">{data.pagination.totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                                        disabled={page === data.pagination.totalPages}
                                        className="cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Package"
                description="Are you sure you want to delete this package? This action acts as a soft delete."
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}