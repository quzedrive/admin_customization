'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePageQueries } from '@/lib/hooks/queries/usePageQueries';
import { usePageMutations } from '@/lib/hooks/mutations/usePageMutations';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    FileText,
    LayoutList,
    LayoutGrid,
    Loader2,
    Eye,
    Globe
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import StatusToggle from '@/components/inputs/ui/StatusToggle';
import DeleteModal from '@/modals/admin/brand-management/DeleteModal';
import { IPage } from '@/lib/services/pageServices';

// Status mapping
const STATUS_MAP = {
    0: { label: 'Deleted', color: 'bg-red-100 text-red-700' },
    1: { label: 'Active', color: 'bg-green-100 text-green-700' },
    2: { label: 'Inactive', color: 'bg-gray-100 text-gray-700' },
};

export default function PagesListPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    // Server-side State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>(''); // "" means all

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Simple debounce effect
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to page 1 on search change
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset page when filter changes
    React.useEffect(() => {
        setPage(1);
    }, [statusFilter, limit]);

    const { usePagesList } = usePageQueries();

    // Pass params to hook
    const { data: pageData, isLoading, isError, error } = usePagesList({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter
    });

    const { deletePage, updatePage } = usePageMutations();

    const pages = pageData?.docs || [];
    const totalPages = pageData?.totalPages || 1;
    const totalDocs = pageData?.totalDocs || 0;

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deletePage.mutate(deleteId, {
                onSuccess: () => {
                    setDeleteId(null);
                }
            });
        }
    };

    const handleStatusToggle = (page: IPage) => {
        const newStatus = page.status === 1 ? 2 : 1;
        setTogglingId(page._id);

        updatePage.mutate(
            { id: page._id, data: { status: newStatus } },
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
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Page Content</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage static content pages like Privacy Policy and Terms.</p>
                </div>
                <Link
                    href="/admin/pages/add-page"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} />
                    Create New Page
                </Link>
            </div>

            {/* Filters & Controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search & Status Filter */}
                <div className="flex flex-1 flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search pages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            onChange={(val) => setStatusFilter(val)}
                            placeholder="Status"
                        />
                    </div>
                    <div className="w-32">
                        <ModernDropdown
                            options={[
                                { value: '10', label: '10 / page' },
                                { value: '20', label: '20 / page' },
                                { value: '50', label: '50 / page' }
                            ]}
                            value={limit.toString()}
                            onChange={(val) => setLimit(Number(val))}
                            placeholder="Limit"
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
                                        <th className="px-6 py-4">Title / Slug</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Last Updated</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 size={24} className="animate-spin text-blue-500" />
                                                    <p>Loading pages...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : isError ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-red-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="font-medium">Failed to load pages</p>
                                                    <p className="text-sm">{(error as any)?.message || 'Unknown error occurred'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : pages.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="h-8 w-8 text-gray-300 mb-2" />
                                                    <p className="text-lg font-medium text-gray-900 mb-1">No pages found</p>
                                                    <p>Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        pages.map((page: IPage) => (
                                            <tr key={page._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{page.title}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-0.5">/{page.slug}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_MAP[page.status as keyof typeof STATUS_MAP]?.color || 'bg-gray-100'}`}>
                                                        {STATUS_MAP[page.status as keyof typeof STATUS_MAP]?.label || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Link
                                                            href={`/admin/pages/view-page/${page.slug}`}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View Page"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                        <StatusToggle
                                                            status={page.status}
                                                            onToggle={() => handleStatusToggle(page)}
                                                            isLoading={togglingId === page._id}
                                                            color='blue'
                                                        />
                                                        <div className="h-4 w-px bg-gray-200"></div>
                                                        <Link
                                                            href={`/admin/pages/add-page?slug=${page.slug}`}
                                                            className="cursor-pointer p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(page._id)}
                                                            className="cursor-pointer p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
                        {/* Pagination Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium">{pages.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-medium">{Math.min(page * limit, totalDocs)}</span> of <span className="font-medium">{totalDocs}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    Next
                                </button>
                            </div>
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
                                    <p>Loading pages...</p>
                                </div>
                            ) : isError ? (
                                <div className="col-span-full py-12 text-center text-red-500 bg-white rounded-xl border border-red-100">
                                    <p className="font-medium">Failed to load pages</p>
                                    <p className="text-sm">{(error as any)?.message || 'Unknown error occurred'}</p>
                                </div>
                            ) : pages.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                                    <p className="text-lg font-medium text-gray-900 mb-1">No pages found</p>
                                    <p>Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                pages.map((page: IPage) => (
                                    <div key={page._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 group relative flex flex-col items-center">
                                        {/* Status Badge - Absolute Top Right */}
                                        <div className="absolute top-2 right-4 z-10">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${page.status === 1
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {page.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {/* Card Header: Icon Left, Info Right */}
                                        <div className="flex items-center w-full gap-4 mb-4 mt-2">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                                <FileText size={24} className="text-blue-500" />
                                            </div>
                                            <div className="flex flex-col items-start min-w-0 flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate w-full tracking-tight text-left" title={page.title}>
                                                    {page.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-mono truncate w-full text-left">
                                                    /{page.slug}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer: Date & Actions */}
                                        <div className="w-full flex items-center justify-between relative pt-4 border-t border-gray-100 mt-auto">
                                            <div className="text-xs font-medium text-gray-400">
                                                {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                                            </div>

                                            {/* Actions - Bottom Right */}
                                            <div className="flex gap-2 items-center">
                                                <Link
                                                    href={`/admin/pages/view-page/${page.slug}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="View Page"
                                                >
                                                    <Globe size={14} />
                                                </Link>
                                                <StatusToggle
                                                    status={page.status}
                                                    onToggle={() => handleStatusToggle(page)}
                                                    isLoading={togglingId === page._id}
                                                    color='blue'
                                                />
                                                <div className="h-4 w-px bg-gray-200"></div>
                                                <Link
                                                    href={`/admin/pages/add-page?slug=${page.slug}`}
                                                    className="cursor-pointer p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(page._id)}
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
                        {/* Pagination Footer */}
                        <div className="flex justify-center mt-8">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-500 self-center">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Page"
                description="Are you sure you want to delete this page? This action cannot be undone."
                isDeleting={deletePage.isPending}
            />
        </div>
    );
}

