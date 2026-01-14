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
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/banner.webp"
                    alt="Track Background"
                    fill
                    className="object-cover brightness-[0.3]"
                    priority
                />
            </div>

            <div className="relative z-10 w-full px-[5.4%] max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Track Your <span className="text-blue-500">Ride</span>
                    </h1>
                    <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                        Enter your booking ID below to check the real-time status of your vehicle delivery.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="relative max-w-lg mx-auto"
                >
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Enter Booking ID (e.g., QZ-12345)"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            className="w-full h-16 pl-6 pr-36 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all font-medium text-lg"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-2 bottom-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold transition-all flex items-center gap-2 group-focus-within:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Track <Search size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </section>
    );
}
