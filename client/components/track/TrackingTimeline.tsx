'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, CalendarCheck, UserCheck, Car, Navigation, Flag } from 'lucide-react';

interface TimelineStep {
    id: number;
    title: string;
    description: string;
    icon: any;
    status: 'completed' | 'current' | 'pending';
    time?: string;
}

const steps: TimelineStep[] = [
    {
        id: 1,
        title: "Booking Confirmed",
        description: "Your booking has been verified and confirmed.",
        icon: CalendarCheck,
        status: 'completed',
        time: "10:30 AM"
    },
    {
        id: 2,
        title: "Car Assigned",
        description: "BMW 5 Series (KA 05 MN 2024) assigned.",
        icon: UserCheck,
        status: 'completed',
        time: "11:15 AM"
    },
    {
        id: 3,
        title: "Out for Delivery",
        description: "Your car is on the way to your location.",
        icon: Car,
        status: 'current',
        time: "Now"
    },
    {
        id: 4,
        title: "Ride Started",
        description: "Handover complete. Enjoy your ride!",
        icon: Navigation,
        status: 'pending'
    },
    {
        id: 5,
        title: "Ride Completed",
        description: "Car returned and inspection done.",
        icon: Flag,
        status: 'pending'
    }
];

export default function TrackingTimeline() {
    return (
        <div className="max-w-4xl mx-auto px-6 pb-20">
            <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-100 md:left-1/2 md:-ml-[1px]" />

                <div className="space-y-12">
                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0;
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className={`relative flex items-center md:items-start flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Icon/Dot */}
                                <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                    ${isCompleted || isCurrent ? 'bg-blue-600 border-blue-100 text-white shadow-lg shadow-blue-200' : 'bg-white border-gray-100 text-gray-300'}
                                `}>
                                    {isCompleted ? <Check size={28} strokeWidth={3} /> : <step.icon size={28} />}

                                    {/* Pulse effect for current */}
                                    {isCurrent && (
                                        <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping -z-10"></span>
                                    )}
                                </div>

                                {/* Spacer (empty half) */}
                                <div className="hidden md:block w-1/2" />

                                {/* Content Card */}
                                <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                                    <div className={`p-6 rounded-2xl border transition-all duration-300
                                        ${isCurrent ? 'bg-white border-blue-200 shadow-xl shadow-blue-50' : 'bg-gray-50 border-transparent'}
                                        ${step.status === 'completed' ? 'bg-white border-gray-100' : ''}
                                    `}>
                                        <div className={`flex items-center gap-3 mb-2 ${isEven ? 'md:flex-row-reverse md:justify-start' : ''}`}>
                                            <h3 className={`font-bold text-lg ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.title}
                                            </h3>
                                            {step.time && (
                                                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                                                    {step.time}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
