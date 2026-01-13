import { cn } from '@/components/utils/cn';
import React from 'react';

interface PopularCarsChartProps {
    data: Array<{ name: string; bookings: number }>;
}

const PopularCarsChart: React.FC<PopularCarsChartProps> = ({ data }) => {
    const maxBookings = Math.max(...data.map((item) => item.bookings), 1);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Vehicles</h3>

            <div className="flex-1 flex flex-col justify-start space-y-6 mt-2">
                {data.map((car, index) => {
                    const percentage = (car.bookings / maxBookings) * 100;
                    const isTop1 = index === 0;
                    const isTop2 = index === 1;
                    const isTop3 = index === 2;

                    return (
                        <div key={index} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full transition-colors",
                                        isTop1 ? "bg-blue-100 text-blue-700" :
                                            isTop2 ? "bg-indigo-100 text-indigo-700" :
                                                isTop3 ? "bg-violet-100 text-violet-700" : "bg-gray-50 text-gray-500 border border-gray-100"
                                    )}>
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                                        {car.name}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                    {car.bookings}
                                </span>
                            </div>

                            <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000 ease-out",
                                        isTop1 ? "bg-blue-600" :
                                            isTop2 ? "bg-indigo-500" :
                                                isTop3 ? "bg-violet-500" : "bg-gray-300"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PopularCarsChart;
