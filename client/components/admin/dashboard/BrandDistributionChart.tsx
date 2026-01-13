import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface BrandDistributionChartProps {
    data: Array<{ name: string; value: number }>;
}

const BrandDistributionChart: React.FC<BrandDistributionChartProps> = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
                    <p className="text-gray-900 font-bold mb-1">{label}</p>
                    <p className="text-blue-600 font-semibold text-sm">
                        {payload[0].value} <span className="text-gray-400 font-normal">Bookings</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Bookings by Brand</h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                        <Bar
                            dataKey="value"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            fill="#3B82F6"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#60A5FA'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BrandDistributionChart;
