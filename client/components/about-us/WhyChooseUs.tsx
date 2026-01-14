'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, HeartHandshake, MapPin, BadgePercent, Headphones } from 'lucide-react';

const reasons = [
    {
        icon: ShieldCheck,
        title: "Safe & Sanitized",
        desc: "Every car undergoes a rigorous cleaning and safety check before delivery."
    },
    {
        icon: Clock,
        title: "On-Time Delivery",
        desc: "We respect your time. Get your car delivered to your doorstep exactly when you need it."
    },
    {
        icon: HeartHandshake,
        title: "No Hidden Charges",
        desc: "What you see is what you pay. Transparent pricing with zero surprise fees."
    },
    {
        icon: MapPin,
        title: "Anywhere Delivery",
        desc: "From airports to your home, we deliver cars across the city for your convenience."
    },
    {
        icon: BadgePercent,
        title: "Best Price Guarantee",
        desc: "Luxury doesn't have to be expensive. We offer competitive rates for premium rides."
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        desc: "Our dedicated team is available round the clock to assist you with any queries."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-gray-50 px-[5.4%]">
            <div className="max-w-[1920px] mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto mb-16"
                >
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Why Choose QuzeeDrive</span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                        Excellence in <span className="text-blue-600">Every Mile</span>
                    </h2>
                    <p className="text-gray-500 text-lg">
                        We go the extra mile to ensure your journey is comfortable, safe, and memorable. Here is why thousands of customers trust us.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group text-left"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
