'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOrderQueries } from '@/lib/hooks/queries/useOrderQueries';
import { useOrderMutations } from '@/lib/hooks/mutations/useOrderMutations';
import { Search, LayoutGrid, LayoutList, Loader2, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import HostDetailsModal from '@/components/admin/order-management/list-page/HostDetailsModal';
import CancelOrderModal from '@/components/admin/order-management/list-page/CancelOrderModal';
import OrderGridView from '@/components/admin/order-management/list-page/OrderGridView';
import OrderTableView from '@/components/admin/order-management/list-page/OrderTableView';
import StatusStatsCards from '@/components/admin/order-management/list-page/StatusStatsCards';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  PAGINATION_SIZES,
  SORT_OPTIONS
} from '@/components/admin/order-management/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function OrderListPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { useAdminOrders } = useOrderQueries();
  const { data: orderData, isLoading } = useAdminOrders({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter ? Number(statusFilter) : undefined,
    paymentStatus: paymentStatusFilter === 'all' ? undefined : paymentStatusFilter ? Number(paymentStatusFilter) : undefined,
    sortBy: sortBy
  });

  const { useCancelOrder, useUpdateOrder } = useOrderMutations();
  const cancelOrderMutation = useCancelOrder();
  const updateOrderMutation = useUpdateOrder();

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Host Details Modal State
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<any>(null);

  const orders = orderData?.orders || [];
  const statusCounts = orderData?.statusCounts || {};
  const totalPages = orderData?.pagination?.totalPages || 1;
  const totalItems = orderData?.pagination?.total || 0;

  // Debounced search handling could be added here, but for now we rely on the hook reacting to state changes.
  // Note: For production with large datasets, debounce the search input.

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentStatusFilter, itemsPerPage, sortBy]);

  const confirmDelete = (id: string) => {
    setSelectedOrderId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteOrder = () => {
    if (selectedOrderId) {
      cancelOrderMutation.mutate(selectedOrderId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedOrderId(null);
        }
      });
    }
  };

  const handleCancelStatus = (id: string) => {
    setSelectedOrderId(id);
    setCancelModalOpen(true);
  };

  const processCancelStatus = (reasonId: string, reasonText: string) => {
    if (selectedOrderId) {
      updateOrderMutation.mutate({
        id: selectedOrderId,
        data: {
          status: 3, // Cancelled
          cancelReason: reasonText,
          cancelReasonId: reasonId
        }
      }, {
        onSuccess: () => {
          setCancelModalOpen(false);
          setSelectedOrderId(null);
        }
      });
    }
  };

  const viewHostDetails = (hostDetails: any) => {
    setSelectedHost(hostDetails);
    setHostModalOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage customer trip requests.</p>
        </div>
      </div>



      <StatusStatsCards
        statusCounts={statusCounts}
        currentStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        {/* Top Row: Search and Filters */}
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone or car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3">
            <div className="w-full lg:w-40">
              <ModernDropdown
                options={[
                  { value: '', label: 'All Statuses' },
                  ...Object.entries(ORDER_STATUS_LABELS)
                    .filter(([k]) => k !== '0')
                    .map(([k, v]) => ({ value: k, label: v }))
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                placeholder="Status"
              />
            </div>
            <div className="w-full lg:w-40">
              <ModernDropdown
                options={[
                  { value: '', label: 'All Payments' },
                  ...Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))
                ]}
                value={paymentStatusFilter}
                onChange={(val) => setPaymentStatusFilter(val)}
                placeholder="Payment"
              />
            </div>
            <div className="w-full lg:w-44">
              <ModernDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                placeholder="Sort By"
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: View Options */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500 font-medium">
            Showing {orders.length} of {totalItems} orders
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span className="whitespace-nowrap">Show</span>
              <div className="w-40">
                <ModernDropdown
                  options={PAGINATION_SIZES}
                  value={itemsPerPage.toString()}
                  onChange={(val) => setItemsPerPage(Number(val))}
                />
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

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
      </div>

      {/* Content */}
      {
        isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 text-gray-500">
            <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 text-gray-400">
            <Calendar size={48} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No orders found</p>
            <p className="text-sm">Try adjusting filters or checking back later.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <OrderGridView
                orders={orders}
                formatDate={formatDate}
                viewHostDetails={viewHostDetails}
                confirmDelete={confirmDelete}
                cancelOrder={handleCancelStatus}
              />
            ) : (
              <OrderTableView
                orders={orders}
                formatDate={formatDate}
                viewHostDetails={viewHostDetails}
                confirmDelete={confirmDelete}
                cancelOrder={handleCancelStatus}
              />
            )}
          </AnimatePresence>
        )
      }

      {/* Pagination Controls */}
      {
        totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600 font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        message="Are you sure you want to delete this order? It will be removed from this list."
        isLoading={cancelOrderMutation.isPending}
      />

      {/* Cancel Status Confirmation Modal */}
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={processCancelStatus}
        isLoading={updateOrderMutation.isPending}
      />

      <HostDetailsModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        hostDetails={selectedHost}
      />
    </div >
  );
}