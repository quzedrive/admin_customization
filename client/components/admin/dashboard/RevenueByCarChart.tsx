import React from 'react';
import { cn } from '@/components/utils/cn';

interface RevenueByCarChartProps {
    data: Array<{ name: string; revenue: number }>;
}

const RevenueByCarChart: React.FC<RevenueByCarChartProps> = ({ data }) => {
    // Determine the max revenue to calculate percentages for bar width
    const maxRevenue = Math.max(...data.map(item => item.revenue), 1);

    const colors = [
        'bg-emerald-500',
        'bg-blue-500',
        'bg-violet-500',
        'bg-amber-500',
        'bg-rose-500',
    ];

    const bgColors = [
        'bg-emerald-50',
        'bg-blue-50',
        'bg-violet-50',
        'bg-amber-50',
        'bg-rose-50',
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Vehicle</h3>
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
                {data.map((item, index) => {
                    const percentage = (item.revenue / maxRevenue) * 100;
                    return (
                        <div key={index} className="w-full">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[180px]" title={item.name}>
                                        {item.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        Vehicle
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className={cn("text-sm font-bold", "text-gray-900")}>
                                        ₹{item.revenue.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className={cn("h-3 w-full rounded-full overflow-hidden", bgColors[index % bgColors.length])}>
                                <div
                                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", colors[index % colors.length])}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                        No revenue data available for this period.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueByCarChart;
