import { cn } from '@/components/utils/cn';
import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface OrdersTrendChartProps {
    data: Array<{ label: string; bookings: number }>;
    period: string;
    onFilterChange: (period: string) => void;
}

const OrdersTrendChart: React.FC<OrdersTrendChartProps> = ({ data, period, onFilterChange }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl min-w-[150px]">
                    <p className="text-gray-500 text-xs font-semibold uppercase mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                        <div>
                            <span className="text-3xl font-bold text-gray-900 block leading-none">{payload[0].value}</span>
                            <span className="text-xs text-gray-400 font-medium">Bookings</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const tabs = [
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' },
    ];

    console.log('OrdersTrendChart Data:', data);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900">Booking Trends</h3>
                <div className="bg-gray-100 p-1 rounded-lg flex items-center self-start sm:self-auto overflow-x-auto max-w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onFilterChange(tab.id)}
                            className={cn(
                                "px-3 py-1.5 cursor-pointer text-xs font-medium rounded-md transition-all",
                                period === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[300px] min-w-0">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                            <defs>
                                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="bookings"
                                stroke="#3B82F6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorBookings)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p>No booking data available for this period</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTrendChart;
