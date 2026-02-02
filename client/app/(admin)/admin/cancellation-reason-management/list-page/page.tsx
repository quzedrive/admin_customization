'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCancellationReasonQueries } from '@/lib/hooks/queries/useCancellationReasonQueries';
import { useCancellationReasonMutations } from '@/lib/hooks/mutations/useCancellationReasonMutations';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    LayoutList,
    LayoutGrid,
    Loader2,
    ListChecks,
    Users,
    Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import StatusToggle from '@/components/inputs/ui/StatusToggle';
import DeleteModal from '@/modals/admin/brand-management/DeleteModal';

export default function CancellationReasonListPage() {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const { useGetReasons } = useCancellationReasonQueries();
    const { data: reasons, isLoading } = useGetReasons();

    const { useDeleteReason, useUpdateReason } = useCancellationReasonMutations();
    const deleteMutation = useDeleteReason();
    const updateMutation = useUpdateReason();

    // Client-side filtering and sorting
    const filteredAndSortedReasons = reasons
        ?.filter((reason: any) => {
            const matchesSearch = reason.reason.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        })
        .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });

    // Pagination
    const totalItems = filteredAndSortedReasons?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReasons = filteredAndSortedReasons?.slice(startIndex, endIndex);

    // Reset to page 1 when search or sort changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOrder, itemsPerPage]);

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

    const handleStatusToggle = (reason: any) => {
        const newStatus = reason.status === 1 ? 2 : 1;
        setTogglingId(reason._id);

        updateMutation.mutate(
            { id: reason._id, data: { status: newStatus } },
            {
                onSuccess: () => setTogglingId(null),
                onError: () => setTogglingId(null)
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cancellation Reasons</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage reasons for booking cancellations.</p>
                </div>
                <Link
                    href="/admin/cancellation-reason-management/add-page"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} />
                    Add Reason
                </Link>
            </div>

            {/* Filters & Controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search & Sort */}
                <div className="flex flex-1 flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search reasons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <div className="w-40">
                        <ModernDropdown
                            options={[
                                { value: 'latest', label: 'Latest First' },
                                { value: 'oldest', label: 'Oldest First' }
                            ]}
                            value={sortOrder}
                            onChange={(val) => setSortOrder(val as 'latest' | 'oldest')}
                            placeholder="Sort"
                        />
                    </div>
                    <div className="w-32">
                        <ModernDropdown
                            options={[
                                { value: '10', label: '10 / page' },
                                { value: '15', label: '15 / page' },
                                { value: '20', label: '20 / page' }
                            ]}
                            value={itemsPerPage.toString()}
                            onChange={(val) => setItemsPerPage(parseInt(val))}
                            placeholder="Items"
                        />
                    </div>

                    {/* View Mode */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`cursor-pointer p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Table View"
                        >
                            <LayoutList size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`cursor-pointer p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

               
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {viewMode === 'table' ? (
                    /* Table View */
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
                                        <th className="px-6 py-4">Reason</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Created At</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 size={24} className="animate-spin text-blue-500" />
                                                    <p>Loading reasons...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedReasons?.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <ListChecks className="h-8 w-8 text-gray-300 mb-2" />
                                                    <p className="text-lg font-medium text-gray-900 mb-1">No reasons found</p>
                                                    <p>Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedReasons?.map((reason: any) => (
                                            <tr key={reason._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{reason.reason}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reason.status === 1
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {reason.status === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {format(new Date(reason.createdAt), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <StatusToggle
                                                            status={reason.status}
                                                            onToggle={() => handleStatusToggle(reason)}
                                                            isLoading={togglingId === reason._id}
                                                            color='purple'
                                                        />
                                                        <div className="h-4 w-px bg-gray-200"></div>
                                                        <Link
                                                            href={`/admin/cancellation-reason-management/add-page?id=${reason._id}`}
                                                            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(reason._id)}
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
                                    <p>Loading reasons...</p>
                                </div>
                            ) : paginatedReasons?.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                                    <p className="text-lg font-medium text-gray-900 mb-1">No reasons found</p>
                                    <p>Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                paginatedReasons?.map((reason: any) => (
                                    <div key={reason._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 group relative flex flex-col">
                                        {/* Status Badge - Absolute Top Right */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${reason.status === 1
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {reason.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {/* Card Content */}
                                        <div className="flex flex-col gap-2 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-2">
                                                <ListChecks size={20} className="text-blue-500" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2" title={reason.reason}>
                                                {reason.reason}
                                            </h3>
                                        </div>

                                        {/* Footer: Date & Actions */}
                                        <div className="w-full flex items-center justify-between relative pt-4 border-t border-gray-100 mt-auto">
                                            {/* Actions - Bottom Left for Grid? Or consistent right? */}
                                            {/* User design has toggle | action | action */}

                                            <div className="flex gap-2 items-center w-full justify-between">
                                                <div className="flex items-center gap-3">
                                                    <StatusToggle
                                                        status={reason.status}
                                                        onToggle={() => handleStatusToggle(reason)}
                                                        isLoading={togglingId === reason._id}
                                                        color='purple'
                                                    />
                                                    <div className="h-4 w-px bg-gray-200"></div>
                                                    <div className="text-xs font-medium text-gray-400">
                                                        {format(new Date(reason.createdAt), 'MMM d, yyyy')}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/cancellation-reason-management/add-page?id=${reason._id}`}
                                                        className="cursor-pointer p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(reason._id)}
                                                        className="cursor-pointer p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="cursor-pointer px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="cursor-pointer px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Reason"
                description="Are you sure you want to delete this cancellation reason? This action cannot be undone."
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}