'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBrandQueries } from '@/lib/hooks/queries/useBrandQueries';
import { useBrandMutations } from '@/lib/hooks/mutations/useBrandMutations';
import { brandServices } from '@/lib/services/brandServices';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  LayoutList,
  LayoutGrid,
  ListFilter
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingInput from '@/components/inputs/FloatingInput';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import ImageField from '@/components/inputs/ImageField';
import { toast } from 'react-hot-toast';
import EditModal from '@/modals/admin/brand-management/EditModal';
import DeleteModal from '@/modals/admin/brand-management/DeleteModal';
import StatusToggle from '@/components/inputs/ui/StatusToggle';

export default function BrandListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editBrand, setEditBrand] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Queries & Mutations
  const { useAdminBrands } = useBrandQueries();
  const { useDeleteBrand, useUpdateBrand } = useBrandMutations();

  // Data Fetching
  const { data, isLoading } = useAdminBrands({
    page,
    limit,
    search,
    status: statusFilter ? Number(statusFilter) : undefined
  });

  const deleteMutation = useDeleteBrand();
  const updateMutation = useUpdateBrand();

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

  const handleStatusToggle = (brand: any) => {
    const newStatus = brand.status === 1 ? 2 : 1;
    setTogglingId(brand._id);

    const formData = new FormData();
    formData.append('status', String(newStatus));
    formData.append('name', brand.name);
    formData.append('slug', brand.slug);
    if (brand.logo) formData.append('logo', brand.logo);

    updateMutation.mutate(
      { id: brand._id, data: formData },
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

  const handleFileChange = (file: File | File[] | null) => {
    if (file && !Array.isArray(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBrand) return;

    try {
      const submitData = new FormData();
      submitData.append('name', editBrand.name);
      submitData.append('slug', editBrand.slug);
      submitData.append('status', String(editBrand.status));

      if (selectedFile) {
        submitData.append('logo', selectedFile);
      } else if (editBrand.logo) {
        submitData.append('logo', editBrand.logo);
      }

      updateMutation.mutate(
        {
          id: editBrand._id,
          data: submitData
        },
        {
          onSuccess: () => {
            setEditBrand(null);
            setSelectedFile(null);
          }
        }
      );
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update brand');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-500 text-sm">Manage your store brands</p>
        </div>
        <Link
          href="/admin/brand-management/add-page"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Add Brand
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
              placeholder="Search brands..."
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
                    <th className="px-6 py-4">Brand Info</th>
                    <th className="px-6 py-4">Slug</th>
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
                          <p>Loading brands...</p>
                        </div>
                      </td>
                    </tr>
                  ) : data?.brands?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <p className="text-lg font-medium text-gray-900 mb-1">No brands found</p>
                        <p>Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    data?.brands?.map((brand: any) => (
                      <tr key={brand._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                              {brand.logo ? (
                                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="text-xs font-bold text-gray-400">{brand.name[0]}</span>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{brand.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-mono">
                            {brand.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${brand.status === 1
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                            }`}>
                            {brand.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {format(new Date(brand.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <StatusToggle
                              status={brand.status}
                              onToggle={() => handleStatusToggle(brand)}
                              isLoading={togglingId === brand._id}
                              color='purple'
                            />
                            <div className="h-4 w-px bg-gray-200"></div>
                            <button
                              onClick={() => setEditBrand(brand)}
                              className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(brand._id)}
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
                  <p>Loading brands...</p>
                </div>
              ) : data?.brands?.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                  <p className="text-lg font-medium text-gray-900 mb-1">No brands found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                data?.brands?.map((brand: any) => (
                  <div key={brand._id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 group relative flex flex-col items-center">

                    {/* Card Header: Image Left, Info Right */}
                    <div className="flex items-center w-full gap-4 mb-4">
                      <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-600" />
                        ) : (
                          <span className="text-3xl font-bold text-gray-300">{brand.name[0]}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate w-full tracking-tight text-left" title={brand.name}>{brand.name}</h3>
                        <p className="text-xs text-gray-500 font-mono rounded-lg w-full truncate text-left">/{brand.slug}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                      <span className={`inline-flex items-center px-6 py-1.5 rounded-full text-sm font-semibold tracking-wide ${brand.status === 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {brand.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Footer: Date & Actions */}
                    <div className="w-full flex items-center justify-between relative pt-4 border-t border-gray-100 mt-auto">
                      <div className="text-xs font-medium text-gray-400">
                        {format(new Date(brand.createdAt), 'MMM d, yyyy')}
                      </div>

                      {/* Actions - Bottom Right */}
                      <div className=" flex gap-3 items-center">
                        <StatusToggle
                          status={brand.status}
                          onToggle={() => handleStatusToggle(brand)}
                          isLoading={togglingId === brand._id}
                          color='purple'
                        />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <button onClick={() => setEditBrand(brand)} className="cursor-pointer p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteClick(brand._id)} className="cursor-pointer p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors" title="Delete">
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

      {/* Edit Modal */}
      {/* Edit Modal Component */}
      <EditModal
        isOpen={!!editBrand}
        onClose={() => {
          setEditBrand(null);
          setSelectedFile(null);
        }}
        brand={editBrand}
        onUpdate={(id, formData) => {
          updateMutation.mutate(
            { id, data: formData },
            {
              onSuccess: () => {
                setEditBrand(null);
                setSelectedFile(null);
              }
            }
          );
        }}
        isUpdating={updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action will remove it from the store permanently."
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}