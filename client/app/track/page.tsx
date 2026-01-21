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
                  {(order.paymentStatus === 2 || order.paymentStatus === 0) && (
                    <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-3xl p-6 md:p-8 mb-12 w-full max-w-2xl mx-auto text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500">
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">Payment Pending</h3>
                          <p className="text-gray-300">
                            Your booking is approved! Please complete the payment to confirm your ride.
                          </p>
                        </div>

                        {/* Payment Options Logic */}
                        {/* Check for Razorpay Link first (Primary preference if generated) */}
                        {order.payment?.link ? (
                          <div className="mt-4 bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                            <h4 className="text-blue-900 font-bold text-lg mb-2">Secure Payment</h4>
                            <p className="text-gray-600 text-sm mb-4">Click below to pay via Razorpay</p>
                            <a
                              href={order.payment.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            >
                              Pay ₹{order.finalPrice?.toLocaleString()} Now
                            </a>
                            <p className="text-[10px] text-gray-400 mt-2">Link expires in 15 minutes</p>
                          </div>
                        ) : (
                          /* Fallback to Manual QR if no link or if Manual mode is implied */
                          /* Using VPA from backend if available, else fallback to env */
                          <>
                            <div className="mt-4 bg-white p-4 rounded-xl shadow-lg">
                              {/* @ts-ignore */}
                              <QRCodeSVG
                                value={`upi://pay?pa=${order.merchantVpa || process.env.NEXT_PUBLIC_MERCHANT_VPA || 'admin@upi'}&pn=${encodeURIComponent(process.env.NEXT_PUBLIC_MERCHANT_NAME || 'Quzee Drive')}&am=${order.finalPrice}&tn=${encodeURIComponent(`Order ${order.bookingId}`)}&tr=${order.bookingId}`}
                                size={200}
                                level="M"
                              />
                            </div>
                            <p className="text-white font-bold text-lg mt-2">
                              Amount to Pay: ₹{order.finalPrice?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 max-w-sm">
                              Scan this QR with any UPI App (GPay, PhonePe, Paytm). <br />
                              After payment, please send the screenshot/UTR to our support for verification.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <TrackingTimeline status={order.status} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}