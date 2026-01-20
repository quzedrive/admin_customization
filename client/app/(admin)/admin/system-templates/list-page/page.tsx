'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemTemplateQueries } from '@/lib/hooks/queries/useSystemTemplateQueries';
import { useSystemTemplateMutations } from '@/lib/hooks/mutations/useSystemTemplateMutations';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Mails,
    LayoutList,
    LayoutGrid,
    ListFilter,
    Loader2,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import StatusToggle from '@/components/inputs/ui/StatusToggle';
import DeleteModal from '@/modals/admin/brand-management/DeleteModal';

export default function SystemTemplateListPage() {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const { useGetAllTemplates } = useSystemTemplateQueries();
    const { data: templates, isLoading, isError, error } = useGetAllTemplates();
    const { deleteTemplateMutation, updateTemplateMutation } = useSystemTemplateMutations();

    // Filtering logic (client-side for now as API doesn't seem to support pagination/filter yet)
    const filteredTemplates = templates?.filter((template: any) => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? template.status === Number(statusFilter) : true;
        return matchesSearch && matchesStatus;
    });

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteTemplateMutation.mutate(deleteId, {
                onSuccess: () => {
                    setDeleteId(null);
                }
            });
        }
    };

    const handleStatusToggle = (template: any) => {
        const newStatus = template.status === 1 ? 2 : 1;
        setTogglingId(template._id);

        // SystemTemplate expects JSON, not FormData, based on my previous service implementation
        updateTemplateMutation.mutate(
            { id: template._id, data: { status: newStatus } },
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
                    <h1 className="text-2xl font-bold text-gray-900">System Templates</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage email, SMS, and push notification templates.</p>
                </div>
                <Link
                    href="/admin/system-templates/add-page"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} />
                    Add Template
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
                            placeholder="Search templates..."
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
                                        <th className="px-6 py-4">Name / Slug</th>
                                        <th className="px-6 py-4">Channels</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Last Updated</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 size={24} className="animate-spin text-blue-500" />
                                                    <p>Loading templates...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : isError ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="font-medium">Failed to load templates</p>
                                                    <p className="text-sm">{(error as any)?.message || 'Unknown error occurred'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTemplates?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Mails className="h-8 w-8 text-gray-300 mb-2" />
                                                    <p className="text-lg font-medium text-gray-900 mb-1">No templates found</p>
                                                    <p>Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTemplates?.map((template: any) => (
                                            <tr key={template._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{template.name}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-0.5">{template.slug}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {template.emailSubject && <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">Email</span>}
                                                        {template.smsContent && <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100">SMS</span>}
                                                        {template.pushBody && <span className="inline-flex items-center px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">Push</span>}
                                                        {!template.emailSubject && !template.smsContent && !template.pushBody && <span className="text-gray-400 text-xs italic">None</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${template.status === 1
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {template.status === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <StatusToggle
                                                            status={template.status}
                                                            onToggle={() => handleStatusToggle(template)}
                                                            isLoading={togglingId === template._id}
                                                            color='purple'
                                                        />
                                                        <div className="h-4 w-px bg-gray-200"></div>
                                                        <Link
                                                            href={`/admin/system-templates/add-page?id=${template._id}`}
                                                            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(template._id)}
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
                                    <p>Loading templates...</p>
                                </div>
                            ) : isError ? (
                                <div className="col-span-full py-12 text-center text-red-500 bg-white rounded-xl border border-red-100">
                                    <p className="font-medium">Failed to load templates</p>
                                    <p className="text-sm">{(error as any)?.message || 'Unknown error occurred'}</p>
                                </div>
                            ) : filteredTemplates?.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                                    <p className="text-lg font-medium text-gray-900 mb-1">No templates found</p>
                                    <p>Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                filteredTemplates?.map((template: any) => (
                                    <div key={template._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 group relative flex flex-col items-center">
                                        {/* Status Badge - Absolute Top Right */}
                                        <div className="absolute top-2 right-4 z-10">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${template.status === 1
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {template.status === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {/* Card Header: Icon Left, Info Right */}
                                        <div className="flex items-center w-full gap-4 mb-4 mt-2">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                                <Mails size={24} className="text-blue-500" />
                                            </div>
                                            <div className="flex flex-col items-start min-w-0 flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate w-full tracking-tight text-left" title={template.name}>
                                                    {template.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-mono truncate w-full text-left">
                                                    {template.slug}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Channels */}
                                        <div className="w-full flex gap-2 mb-6">
                                            {template.emailSubject && <div title="Email" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Mails size={14} /></div>}
                                            {template.smsContent && <div title="SMS" className="p-1.5 bg-green-50 text-green-600 rounded-lg"><MessageSquare size={14} /></div>}
                                            {template.pushBody && <div title="Push" className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Bell size={14} /></div>}
                                            {!template.emailSubject && !template.smsContent && !template.pushBody && <span className="text-gray-400 text-xs italic">No channels</span>}
                                        </div>

                                        {/* Footer: Date & Actions */}
                                        <div className="w-full flex items-center justify-between relative pt-4 border-t border-gray-100 mt-auto">
                                            <div className="text-xs font-medium text-gray-400">
                                                {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                                            </div>

                                            {/* Actions - Bottom Right */}
                                            <div className="flex gap-3 items-center">
                                                <StatusToggle
                                                    status={template.status}
                                                    onToggle={() => handleStatusToggle(template)}
                                                    isLoading={togglingId === template._id}
                                                    color='purple'
                                                />
                                                <div className="h-4 w-px bg-gray-200"></div>
                                                <Link
                                                    href={`/admin/system-templates/add-page?id=${template._id}`}
                                                    className="cursor-pointer p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(template._id)}
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Template"
                description="Are you sure you want to delete this template? This action cannot be undone."
                isDeleting={deleteTemplateMutation.isPending}
            />
        </div>
    );
}