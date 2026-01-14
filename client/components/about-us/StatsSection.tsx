'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const stats = [
    { label: "Happy Customers", value: "15k+" },
    { label: "Cars in Fleet", value: "500+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Miles Driven", value: "10M+" },
];

export default function StatsSection() {
    return (
        <section className="py-20 bg-black text-white px-[5.4%]">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="pt-8 md:pt-0"
                        >
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                                {stat.value}
                            </h3>
                            <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
