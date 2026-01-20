import { RideStatus, rideStatusConfig } from '@/constants/ride';
import React from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

interface OrderStatusChartProps {
    data: Array<{ status: number; count: number }>;
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
    const total = data.reduce((acc, curr) => acc + curr.count, 0);

    const statusColorMap: Record<number, string> = {
        [RideStatus.NEW]: '#F59E0B', // Amber-500
        [RideStatus.APPROVE]: '#3B82F6', // Blue-500
        [RideStatus.RIDE_STARTED]: '#8B5CF6', // Violet-500
        [RideStatus.RIDE_COMPLETED]: '#10B981', // Emerald-500
        [RideStatus.CANCEL]: '#EF4444', // Red-500
        [RideStatus.DELETED]: '#94A3B8', // Slate-400
    };

    const refinedData = data.map((item) => {
        const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
        return {
            name: rideStatusConfig[item.status as RideStatus]?.label || `Status ${item.status}`,
            value: item.count,
            percentage,
            fill: statusColorMap[item.status] || '#CBD5E1'
        };
    });

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.fill }} />
                        <span className="font-semibold text-gray-700 text-sm">{data.name}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">{data.value}</span>
                        <span className="text-gray-500 text-xs font-medium">({data.percentage}%)</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Total: {total}</span>
            </div>
            <div className="flex-1 min-h-[300px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={refinedData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {refinedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span className="text-sm text-gray-500 font-medium ml-1">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrderStatusChart;
