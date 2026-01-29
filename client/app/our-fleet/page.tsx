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
  const { useGetPublicCarsInfinite } = useCarQueries();
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useGetPublicCarsInfinite(10, filters);

  // Flatten the pages into a single cars array
  const cars = data?.pages.flatMap((page: any) => page.cars) || [];

  // Server-side filters for sidebar (take from first page or accumulate?)
  // Usually first page has the aggregations or we query specific endpoint.
  // Assuming our controller returns 'filters' on every page (it does), we can filter from first page.
  const serverFilters = (data?.pages[0] as any)?.filters;
  const uniqueBrands = serverFilters?.brands || [];
  const uniqueTypes = serverFilters?.types || [];

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Infinite Scroll Trigger
  // Simple listener for bottom of page or a "Load More" button.
  // For "on scroll", we can use an Intersection Observer or a simple onScroll handler.
  // Ideally use 'react-intersection-observer' but avoiding new deps if possible.
  // Let's us a simple div ref at the bottom.
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Helper to bridge FleetSidebar...

  // Helper to bridge FleetSidebar's expected useState setter interface with Redux
  const updateFiltersWrapper = (newFilters: any) => {
    if (typeof newFilters === 'function') {
      const result = newFilters(filters);
      dispatch(setFilters(result));
    } else {
      dispatch(setFilters(newFilters));
    }
  };

  // We need unique filters derived from data or static constants. 
  // Ideally, these come from specific API endpoints or aggregated data.
  // For now, we derive from the returned cars, but this might be limited if the returned set is small.
  // Ideally, we should fetch "all available options" separately.
  // Assuming 'cars' contains the filtered set, we can stick to using the current filtered set for available options OR 
  // ideally use a separate "aggregations" endpoint. 
  // For simplicity and user request, we use what we have or static lists if data is empty.

  // No more client-side filtering! 
  // const filteredCars = ... REMOVED


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
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car: any) => (
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
                  className="cursor-pointer mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Scroll Trigger & Loading State */}
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Loading more cars...</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}