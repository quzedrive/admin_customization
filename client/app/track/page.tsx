'use client';

import React, { useState } from 'react';
import TrackHero from '@/components/track/TrackHero';
import TrackingTimeline from '@/components/track/TrackingTimeline';
import { AnimatePresence, motion } from 'framer-motion';
// import { useQuery } from '@tanstack/react-query'; // Removed unused import
import { useOrderQueries } from '@/lib/hooks/queries/useOrderQueries';
// import { orderServices } from '@/lib/services/orderServices'; // Removed unused import
import { Loader2, AlertCircle } from 'lucide-react';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { useTrackOrder } = useOrderQueries();
  const { data: order, isLoading, isError, error, refetch } = useTrackOrder(trackingId, { enabled: false });

  const handleTrack = (id: string) => {
    setTrackingId(id);
    setIsSearching(true);
    // Determine if we need to refetch manually or if setting state triggers it
    setTimeout(() => {
      refetch().finally(() => setIsSearching(false));
    }, 100);
  };

  const showContent = !isLoading && !isSearching && (order || isError);

  return (
    <main className="bg-white min-h-screen flex flex-col">

      <div className="flex-1">
        <TrackHero onTrack={handleTrack} isLoading={isLoading || isSearching} />

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white pt-20 overflow-hidden"
            >
              {isError ? (
                <div className="text-center mb-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find an order with ID <span className="font-mono font-medium text-gray-700">#{trackingId}</span>.
                    Please check the ID and verify it is correct.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-16 px-4">
                    <span className={`font-bold tracking-wider uppercase text-sm mb-2 block ${order.status === 3 || order.status === 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {order.status === 3 || order.status === 0 ? 'Order Cancelled' : 'Live Status'}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 break-all">
                      Tracking ID: <span className="text-blue-600 block sm:inline">#{order.bookingId || order._id}</span>
                    </h2>
                    {order.carName && (
                      <p className="text-gray-500 font-medium">
                        Vehicle: {order.carName}
                      </p>
                    )}
                  </div>
                  <TrackingTimeline status={order.status} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}