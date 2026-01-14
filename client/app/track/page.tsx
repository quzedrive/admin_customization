'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrackHero from '@/components/track/TrackHero';
import TrackingTimeline from '@/components/track/TrackingTimeline';
import { AnimatePresence, motion } from 'framer-motion';

export default function TrackPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'active'>('idle');

  const handleTrack = (id: string) => {
    setStatus('loading');
    // Simulate API delay for effect
    setTimeout(() => {
      setStatus('active');
    }, 1500);
  };

  return (
    <main className="bg-white min-h-screen flex flex-col">
  
      <div className="flex-1">
        <TrackHero onTrack={handleTrack} isLoading={status === 'loading'} />

        <AnimatePresence>
          {status === 'active' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white pt-20 overflow-hidden"
            >
              <div className="text-center mb-16 px-4">
                <span className="text-green-500 font-bold tracking-wider uppercase text-sm mb-2 block">Live Status</span>
                <h2 className="text-3xl font-black text-gray-900">
                  Tracking ID: <span className="text-blue-600">#QZ-8821X</span>
                </h2>
              </div>
              <TrackingTimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}