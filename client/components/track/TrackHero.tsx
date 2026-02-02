'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface TrackHeroProps {
    onTrack: (id: string) => void;
    isLoading?: boolean;
}

export default function TrackHero({ onTrack, isLoading }: TrackHeroProps) {
    const [bookingId, setBookingId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (bookingId.trim()) {
            onTrack(bookingId);
        }
    };

    return (
        <div className="w-full text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-3xl sm:text-3xl md:text-6xl 3xl:text-7xl 4xl:text-[100px] text-white text-center drop-shadow-lg font-adlam-display mb-5">
                    Track Your Ride
                </h1>
                <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
                    Enter your booking ID below to check the real-time status of your vehicle delivery.
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="relative max-w-xl mx-auto mb-6"
            >
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Enter Booking Id"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full !text-white h-14 pl-6 pr-20 md:pr-32 rounded-lg bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gray-500 transition-all font-medium text-base"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-1.5 top-1.5 bottom-1.5 cursor-pointer secondary-btn px-6 rounded-md font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-gray-800"
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <>
                                <span className='hidden md:block'>TRACK</span> <Search size={14} />
                            </>
                        )}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
