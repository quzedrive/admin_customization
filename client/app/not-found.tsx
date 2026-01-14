'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, MapPin, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 left-20 transform -rotate-12">
                    <Car size={300} />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center z-10 max-w-lg"
            >
                <div className="relative mb-6">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    >
                        <Car size={64} className="text-blue-600" />
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 border-2 border-white"
                    >
                        <div className="text-xs font-bold px-1">404</div>
                    </motion.div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                    Wrong Turn?
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Looks like the road you're on leads nowhere. Don't worry, we can get you back on track to your next adventure.
                </p>

                <Link
                    href="/"
                    className="group relative flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Home size={18} />
                    <span>Return Home</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </motion.div>

            {/* Footer minimal */}
            <div className="absolute bottom-8 text-gray-400 text-xs">
                Quzeedrive
            </div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M13.5 4.5L21 12M21 12L13.5 19.5M21 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}