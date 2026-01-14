'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function OurMission() {
    const features = [
        "Premium Fleet Selection",
        "24/7 Customer Support",
        "Transparent Pricing",
        "Seamless Booking App"
    ];

    return (
        <section className="py-20 md:py-32 bg-white px-[5.4%] overflow-hidden">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/banner.webp"
                                alt="Our Mission"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                        {/* Float Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute -bottom-8 -right-8 md:bottom-10 md:-right-10 bg-white p-6 rounded-2xl shadow-xl max-w-[200px] hidden md:block"
                        >
                            <p className="text-4xl font-black text-blue-600 mb-1">10+</p>
                            <p className="text-sm font-medium text-gray-600">Years of Excellence in Mobility</p>
                        </motion.div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Mission</span>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            Redefining How You <br /> Experience Travel.
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">
                            At QuzeeDrive, our mission is simple: to provide freedom on wheels. We believe that the journey is just as important as the destination. That's why we've curated a fleet of top-tier vehicles and streamlined our booking process to ensure your experience is nothing short of perfection.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                                    <span className="font-medium text-gray-800">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
