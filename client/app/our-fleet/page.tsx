'use client';

import React, { useState, useLayoutEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FleetSidebar from '@/components/our-fleet/FleetSidebar';
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';
import CarCard from '@/modals/cards/CarCard';
import CarCardSkeleton from '@/components/skeletons/CarCardSkeleton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setFilters, resetFilters } from '@/redux/slices/filterSlice';
import { Filter, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function OurFleetPage() {
  const { useGetPublicCars } = useCarQueries();
  const { data, isLoading } = useGetPublicCars();
  const cars = Array.isArray(data) ? data : (data as any)?.cars || [];

  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Helper to bridge FleetSidebar's expected useState setter interface with Redux
  // FleetSidebar likely calls setFilters(prev => ... ) or setFilters(newValue)
  // We need to handle both if possible, or refactor FleetSidebar. 
  // For now, let's update FleetSidebar signature in next step if needed. 
  // But here's a compatible wrapper if FleetSidebar passes a new object:
  const updateFiltersWrapper = (newFilters: any) => {
    // If it's a function (functional update), resolve it
    if (typeof newFilters === 'function') {
      const result = newFilters(filters);
      dispatch(setFilters(result));
    } else {
      dispatch(setFilters(newFilters));
    }
  };

  // Extract unique values for dynamic filters
  const uniqueBrands = Array.from(new Set(cars.map((c: any) => c.brand))).filter(Boolean) as string[];
  const uniqueTypes = Array.from(new Set(cars.map((c: any) => c.type))).filter(Boolean) as string[];

  // Filter Logic
  const filteredCars = cars.filter((car: any) => {
    const matchBrand = filters.brands.length === 0 || (filters.brands as string[]).includes(car.brand);
    const matchType = filters.types.length === 0 || (filters.types as string[]).includes(car.type);
    const matchTrans = filters.transmission.length === 0 || (filters.transmission as string[]).includes(car.transmission);
    const matchFuel = filters.fuelType.length === 0 || (filters.fuelType as string[]).includes(car.fuelType);

    // Capacity Logic
    const matchCapacity = filters.capacity.length === 0 || (filters.capacity as string[]).some((cap: string) => {
      if (cap === '8+') return car.seatingCapacity >= 8;
      return car.seatingCapacity === parseInt(cap);
    });

    return matchBrand && matchType && matchTrans && matchFuel && matchCapacity;
  });

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Header Banner */}
      <div className="bg-black pt-32 pb-16 px-[5.4%] text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
          Our Premium Fleet
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our diverse collection of vehicles, from luxury sedans to powerful SUVs. Find the perfect ride for your journey.
        </p>
      </div>

      <div className="max-w-[1920px] mx-auto px-[5.4%] py-12">
        <div className="flex flex-col lg:flex-row gap-8 relative">

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-xl font-bold text-gray-800 shadow-sm"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FleetSidebar
                filters={filters}
                setFilters={updateFiltersWrapper}
                brands={uniqueBrands}
                types={uniqueTypes}
              />
            </div>
          </div>

          {/* Sidebar (Mobile Drawer) */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileFilterOpen(false)}
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
                >
                  <FleetSidebar
                    filters={filters}
                    setFilters={updateFiltersWrapper}
                    brands={uniqueBrands}
                    types={uniqueTypes}
                    closeMobile={() => setMobileFilterOpen(false)}
                    className="h-full border-none rounded-none shadow-none"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Car Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car: any) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Filter size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  We couldn't find any cars matching your filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}