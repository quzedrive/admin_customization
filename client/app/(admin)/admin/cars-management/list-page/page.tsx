'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';
import { useCarMutations } from '@/lib/hooks/mutations/useCarMutations';
import { Plus, Search, LayoutGrid, LayoutList, Loader2, MoreVertical, Pencil, Trash2, CarFront, Users, Fuel, Gauge } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ModernDropdown from '@/components/inputs/ModernDropDown';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { CAR_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, PAGINATION_SIZES } from '@/components/admin/cars-management/constants';
import StatusToggle from '@/components/inputs/ui/StatusToggle';

export default function CarListPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table'); // Default to grid for cars as images are important
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { useGetAllCars } = useCarQueries();
  const { data: cars, isLoading } = useGetAllCars();
  const { deleteCarMutation, toggleStatusMutation } = useCarMutations();

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  // Filter logic
  const filteredCars = cars?.filter((car: any) => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? car.type === typeFilter : true;
    const matchesTransmission = transmissionFilter ? car.transmission === transmissionFilter : true;
    const matchesFuel = fuelFilter ? car.fuelType === fuelFilter : true;
    return matchesSearch && matchesType && matchesTransmission && matchesFuel;
  });

  // Pagination Logic
  const totalItems = filteredCars?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedCars = filteredCars?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, transmissionFilter, fuelFilter, itemsPerPage]);

  const confirmDelete = (id: string) => {
    setSelectedCarId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedCarId) {
      deleteCarMutation.mutate(selectedCarId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedCarId(null);
        }
      });
    }
  };

  const handleStatusToggle = (id: string, currentStatus: number) => {
    // Toggle between 1 (Active) and 2 (Inactive)
    // If we want to be explicit, send the target status.
    const newStatus = currentStatus === 1 ? 2 : 1;
    toggleStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your vehicle fleet, pricing, and availability.</p>
        </div>
        <Link
          href="/admin/cars-management/add-page"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Add Car
        </Link>
      </div>

      {/* Controls */}
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        {/* Top Row: Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-3">
            <div className="w-full sm:w-36">
              <ModernDropdown
                options={[{ value: '', label: 'All Types' }, ...CAR_TYPES]}
                value={typeFilter}
                onChange={(val) => setTypeFilter(val)}
                placeholder="Type"
              />
            </div>
            <div className="w-full sm:w-44">
              <ModernDropdown
                options={[{ value: '', label: 'All Transmissions' }, ...TRANSMISSION_TYPES]}
                value={transmissionFilter}
                onChange={(val) => setTransmissionFilter(val)}
                placeholder="Transmission"
              />
            </div>
            <div className="w-full col-span-2 sm:col-span-1 sm:w-36">
              <ModernDropdown
                options={[{ value: '', label: 'All Fuels' }, ...FUEL_TYPES]}
                value={fuelFilter}
                onChange={(val) => setFuelFilter(val)}
                placeholder="Fuel"
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: View Options */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500 font-medium">
            Showing {filteredCars?.length || 0} vehicles
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Pagination Size Control */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span className="whitespace-nowrap">Show</span>
              <div className="w-24 sm:w-40">
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
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 text-gray-500">
          <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
          <p>Loading fleet...</p>
        </div>
      ) : filteredCars?.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 text-gray-400">
          <CarFront size={48} className="mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-900">No cars found</p>
          <p className="text-sm">Try adding a new car or adjusting filters.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedCars?.map((car: any) => (
                <div key={car._id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
                  <div className="relative h-48 bg-[#f8f9fa] p-4 flex items-center justify-center">
                    {car.images?.[0]?.url ? (
                      <img src={car.images[0].url} alt={car.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <CarFront size={32} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                      ${car.hourlyCharge}/hr
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{car.name}</h3>
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">{car.type}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{car.type}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 my-3">
                      <span className="flex items-center gap-1"><Gauge size={14} /> {car.transmission}</span>
                      <span className="flex items-center gap-1"><Fuel size={14} /> {car.fuelType}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {car.seatingCapacity} Seats</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusToggle
                          status={car.status}
                          onToggle={() => handleStatusToggle(car._id, car.status)}
                          isLoading={toggleStatusMutation.isPending && toggleStatusMutation.variables?.id === car._id}
                          color="purple"
                        />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(car.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/cars-management/view-page/${car._id}`}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/cars-management/add-page/${car._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Car"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => confirmDelete(car._id)}
                          className="p-1.5 cursor-pointer text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Car"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Car Info</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Pricing</th>
                      <th className="px-6 py-4">Packages</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedCars?.map((car: any) => (
                      <tr key={car._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {car.images?.[0]?.url ? (
                                <img src={car.images[0].url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><CarFront size={16} /></div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{car.name}</div>
                              <div className="text-xs text-blue-500 font-mono mt-0.5">{car.slug}</div>
                              <div className="text-xs text-gray-500">{car.type} • {car.transmission}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${car.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {car.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">${car.hourlyCharge}/hr</div>
                          <div className="text-xs text-gray-500">Base: ${car.basePrice}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-500">
                            {car.packages?.filter((p: any) => p.isActive).length} active
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <StatusToggle
                              status={car.status}
                              onToggle={() => handleStatusToggle(car._id, car.status)}
                              isLoading={toggleStatusMutation.isPending && toggleStatusMutation.variables?.id === car._id}
                              color="purple"
                            />
                            <div className="h-4 w-px bg-gray-200"></div>
                            <Link
                              href={`/admin/cars-management/view-page/${car._id}`}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </Link>
                            <Link
                              href={`/admin/cars-management/add-page/${car._id}`}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Car"
                            >
                              <Pencil size={18} />
                            </Link>
                            <button
                              onClick={() => confirmDelete(car._id)}
                              className="p-1.5 cursor-pointer text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Car"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )
      }

      {/* Pagination Controls */}
      {
        filteredCars?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-gray-100">


            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
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
        onConfirm={handleDelete}
        title="Delete Car"
        message="Are you sure you want to delete this car? This action will hide it from the platform."
        isLoading={deleteCarMutation.isPending}
      />
    </div >
  );
}