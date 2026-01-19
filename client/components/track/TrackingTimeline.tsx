'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, CalendarCheck, UserCheck, Car, Navigation, Flag, Clock, CircleAlert } from 'lucide-react';

interface TimelineStep {
    id: number;
    title: string;
    description: string;
    icon: any;
}

const steps: TimelineStep[] = [
    {
        id: 1,
        title: "Waiting for Confirmation",
        description: "We have received your booking request and are reviewing it.",
        icon: Clock,
    },
    {
        id: 2,
        title: "Booked",
        description: "Your booking has been verified and confirmed.",
        icon: CalendarCheck,
    },
    {
        id: 3,
        title: "Started",
        description: "The ride has started. Have a safe journey!",
        icon: Car,
    },
    {
        id: 4,
        title: "Completed",
        description: "Ride completed successfully. Thank you for choosing us.",
        icon: Flag,
    }
];

interface TrackingTimelineProps {
    status?: number; // Order status from backend
}

export default function TrackingTimeline({ status }: TrackingTimelineProps) {

    // Map Backend Status to Timeline Steps
    // 0: Deleted
    // 1: Approved -> Booked (Step 2)
    // 2: New -> Waiting for Confirmation (Step 1)
    // 3: Cancelled -> (Handled separately)
    // 4: Started -> Started (Step 3)
    // 5: Ride Completed -> Completed (Step 4)

    let currentStepId = 0;
    let isCancelled = false;

    if (status === 3 || status === 0) { // Cancelled or Deleted
        isCancelled = true;
    } else {
        switch (status) {
            case 2: // New
                currentStepId = 1;
                break;
            case 1: // Approved
                currentStepId = 2;
                break;
            case 4: // Started
                currentStepId = 3;
                break;
            case 5: // Completed
                currentStepId = 4;
                break;
            default:
                currentStepId = 0; // Unknown or initial
        }
    }

    if (isCancelled) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-10">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CircleAlert size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-red-700 mb-2">Booking Cancelled</h3>
                    <p className="text-red-600/80">
                        This booking has been cancelled. Please contact support if you have any questions.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 pb-20">
            <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-100 md:left-1/2 md:-ml-[1px]" />

                <div className="space-y-12">
                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0;
                        const isCompleted = step.id < currentStepId;
                        const isCurrent = step.id === currentStepId;
                        const isPending = step.id > currentStepId;

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
                                    ${isCompleted ? 'bg-blue-600 border-blue-100 text-white' : ''}
                                    ${isCurrent ? 'bg-white border-blue-500 text-blue-600 shadow-lg shadow-blue-200' : ''}
                                    ${isPending ? 'bg-white border-gray-100 text-gray-300' : ''}
                                `}>
                                    {isCompleted ? <Check size={28} strokeWidth={3} /> : <step.icon size={28} />}

                                    {/* Pulse effect for current */}
                                    {isCurrent && (
                                        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping -z-10"></span>
                                    )}
                                </div>

                                {/* Spacer (empty half) */}
                                <div className="hidden md:block w-1/2" />

                                {/* Content Card */}
                                <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                                    <div className={`p-6 rounded-2xl border transition-all duration-300
                                        ${isCurrent ? 'bg-white border-blue-200 shadow-xl shadow-blue-50' : 'bg-gray-50 border-transparent'}
                                        ${isCompleted ? 'bg-white border-gray-100 opacity-80' : ''}
                                    `}>
                                        <div className={`flex items-center gap-3 mb-2 ${isEven ? 'md:flex-row-reverse md:justify-start' : ''}`}>
                                            <h3 className={`font-bold text-lg ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.title}
                                            </h3>
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
