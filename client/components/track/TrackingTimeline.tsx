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
        description: "We've received your booking request and are reviewing the details",
        icon: Check, // Using Check as generic placeholder, but design had specific icons
    },
    {
        id: 2,
        title: "Booked",
        description: "Your booking has been verified and confirmed",
        icon: Check,
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
        description: "Ride completed successfully. Thank you for choosing us",
        icon: Flag, // Or MapPin if closer to design
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
                <div className="bg-red-900/50 border border-red-500/30 backdrop-blur-sm rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CircleAlert size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-red-400 mb-1">Booking Cancelled</h3>
                    <p className="text-red-300/80 text-sm">
                        This booking has been cancelled.
                    </p>
                </div>
            </div>
        );
    }

    const totalSteps = steps.length;
    // Calculate progress percentage for the active line (between 0% and 100%)
    // If currentStepId is 1, progress is 0%. If 2, 33%. If 3, 66%. If 4, 100%.
    const progressPercentage = Math.max(0, Math.min(100, ((currentStepId - 1) / (totalSteps - 1)) * 100));

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">

                {/* Desktop Horizontal Line Container */}
                <div className="hidden md:block absolute top-[24px] left-[12.5%] right-[12.5%] h-[2px] bg-gray-800 -z-0">
                    {/* Active Progress Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                </div>

                {/* Mobile Vertical Line Container */}
                <div className="md:hidden absolute top-[24px] bottom-[calc(100%-last-step)] left-1/2 w-[2px] bg-gray-800 -z-0 -translate-x-1/2 h-[calc(100%-48px)]">
                    {/* Active Progress Line (Vertical) */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="w-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] origin-top"
                    />
                </div>

                {steps.map((step, index) => {
                    const isCompleted = step.id < currentStepId;
                    const isCurrent = step.id === currentStepId;
                    const isActiveOrCompleted = step.id <= currentStepId;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="flex flex-col items-center text-center relative z-10"
                        >
                            {/* Icon Circle */}
                            <div className="relative">
                                {/* Blinking Glow for Current Step */}
                                {isCurrent && (
                                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping"></span>
                                )}

                                {isCurrent && (
                                    <span className="absolute -inset-1 rounded-full bg-white/20 animate-pulse"></span>
                                )}

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative z-10
                                    ${isActiveOrCompleted
                                        ? 'bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                        : 'bg-[#0a0a0a] border-gray-700 text-gray-500'
                                    }
                                `}>
                                    {isActiveOrCompleted ? (
                                        isCompleted ? <Check size={20} strokeWidth={3} /> : <step.icon size={20} strokeWidth={2} />
                                    ) : (
                                        <step.icon size={20} strokeWidth={2} />
                                    )}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="mt-4 md:mt-6 bg-black md:bg-transparent p-2 md:p-0 rounded-lg relative z-20">
                                <h3 className={`text-base font-bold mb-2 transition-colors duration-300 ${isActiveOrCompleted ? 'text-white' : 'text-gray-500'}`}>
                                    {step.title}
                                </h3>
                                <p className={`text-xs max-w-[200px] leading-relaxed transition-colors duration-300 ${isActiveOrCompleted ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
