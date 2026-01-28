'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta-sans',
});

export default function AboutHero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/about/about-hero-bg.webp"
                    alt="About QuzeeDrive"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-[5.4%] max-w-5xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block primary-text font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-md"
                >
                    About QuzeeDrive
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`text-4xl md:text-6xl lg:text-6xl font-bold text-white mb-6 leading-tight ${plusJakartaSans.className}`}
                >
                    Every Mile Made <span className="primary-text">Comfortable</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-gray-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-12"
                >
                    A car rental service built on trust, care, and customer satisfaction
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link href="/our-fleet" className="primary-outline-btn px-8 py-3 rounded-full font-semibold ">Travel With Us</Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
