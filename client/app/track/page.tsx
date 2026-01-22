'use client';

import React, { useState } from 'react';
import TrackHero from '@/components/track/TrackHero';
import TrackingTimeline from '@/components/track/TrackingTimeline';
import { AnimatePresence, motion } from 'framer-motion';
// import { useQuery } from '@tanstack/react-query'; // Removed unused import
import { useOrderQueries } from '@/lib/hooks/queries/useOrderQueries';
// import { orderServices } from '@/lib/services/orderServices'; // Removed unused import
import { Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { useTrackOrder } = useOrderQueries();
  const { data: order, isLoading, isError, error, refetch } = useTrackOrder(trackingId, { enabled: false });

  const handleTrack = (id: string) => {
    setTrackingId(id);
    setIsSearching(true);
    setTimeout(() => {
      refetch().finally(() => setIsSearching(false));
    }, 100);
  };

  const showContent = !isLoading && !isSearching && (order || isError);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start p-6 overflow-hidden bg-black pt-28 pb-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/track-page.webp"
          alt="Track Background"
          fill
          className="object-cover" // Lower opacity for dark effect
          priority
        />
        {/* Gradient Overlay for better text readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#1a1a1a]/60 to-[#1a1a1a]/90"></div> */}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <TrackHero onTrack={handleTrack} isLoading={isLoading || isSearching} />

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {isError ? (
                <div className="text-center mb-8 bg-[#1a1a1a]/60 backdrop-blur-md p-8 rounded-2xl border border-gray-700 max-w-lg mx-auto">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-4">
                    <AlertCircle size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
                  <p className="text-gray-400">
                    We couldn't find an order with ID <span className="font-mono text-white">#{trackingId}</span>.
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  {/* Status Card */}
                  <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-700 rounded-3xl p-6 md:p-6 mb-12 w-fit mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-left w-full">
                        <div className="flex items-center justify-start gap-3 mb-2">
                          <span className="text-gray-400 text-sm font-medium">Vehicle: <br className='md:hidden' /> <span className="text-white font-bold ml-1">{order.carName || 'Custom Vehicle'}</span></span>
                          <span className={`h-6 px-3 inline-flex justify-center items-center rounded-full text-[10px] font-black uppercase tracking-wider
                                    ${order.status === 3 || order.status === 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-600/20 text-green-500'}
                                `}>
                            {order.status === 3 || order.status === 0 ? 'CANCELLED' : <span className="mt-[1px]">LIVE STATUS</span>}
                          </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-gray-400">
                          Tracking ID <span className="text-white">{order.bookingId || order._id}</span>
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Payment Pending Section */}


                  {/* Timeline */}
                  <TrackingTimeline status={order.status} paymentStatus={order.paymentStatus} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}