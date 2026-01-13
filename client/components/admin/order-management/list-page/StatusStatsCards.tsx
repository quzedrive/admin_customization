
import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    XCircle,
    Clock,
    PlayCircle,
    CheckSquare,
    Wallet,
    LayoutDashboard
} from 'lucide-react';
import { ORDER_STATUS_LABELS } from '../constants';

interface StatusStatsCardsProps {
    statusCounts: Record<string, number>;
    currentStatus: string;
    onStatusChange: (status: string) => void;
}

const STATUS_ICONS: Record<string, any> = {
    'all': LayoutDashboard,
    '2': Clock, // New
    '1': CheckCircle2, // Approved
    '4': PlayCircle, // Started
    '5': CheckSquare, // Completed
    '3': XCircle, // Cancelled
    '6': Wallet, // Payment Completed
};

export default function StatusStatsCards({
    statusCounts,
    currentStatus,
    onStatusChange
}: StatusStatsCardsProps) {

    // Calculate 'All' count
    const totalCount = Object.values(statusCounts || {}).reduce((a, b) => a + b, 0);

    const stats = [
        { id: 'all', label: 'All Orders', count: totalCount, icon: LayoutDashboard },
        ...Object.entries(ORDER_STATUS_LABELS)
            .filter(([k]) => k !== '0') // Exclude Deleted
            .map(([k, v]) => ({
                id: k,
                label: v,
                count: statusCounts?.[k] || 0,
                icon: STATUS_ICONS[k] || Clock
            }))
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {stats.map((stat) => {
                const isActive = currentStatus === stat.id || (currentStatus === '' && stat.id === 'all');
                const Icon = stat.icon;

                // Determine background color for the active state
                let activeBg = 'bg-gray-900';
                if (stat.id === 'all') activeBg = 'bg-gray-900 shadow-gray-500/30';
                else if (stat.id === '1') activeBg = 'bg-blue-600 shadow-blue-500/30'; // Approved
                else if (stat.id === '2') activeBg = 'bg-yellow-500 shadow-yellow-500/30'; // New
                else if (stat.id === '3') activeBg = 'bg-red-500 shadow-red-500/30'; // Cancelled
                else if (stat.id === '4') activeBg = 'bg-purple-600 shadow-purple-500/30'; // Started
                else if (stat.id === '5') activeBg = 'bg-green-600 shadow-green-500/30'; // Completed
                else if (stat.id === '6') activeBg = 'bg-emerald-600 shadow-emerald-500/30'; // Payment Completed

                return (
                    <button
                        key={stat.id}
                        onClick={() => onStatusChange(stat.id === 'all' ? '' : stat.id)}
                        className={`
                            relative cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 w-full outline-none
                            ${isActive ? 'border-transparent' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'}
                        `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeStatusCard"
                                className={`absolute inset-0 rounded-xl shadow-lg ${activeBg}`}
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        <div className="relative z-10 flex flex-col items-center">
                            <div className={`mb-2 p-1.5 rounded-full transition-colors duration-200 ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <Icon size={18} />
                            </div>
                            <span className={`text-2xl font-bold mb-0.5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                {stat.count}
                            </span>
                            <span className={`text-xs font-medium text-center transition-colors duration-200 ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                                {stat.label}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
