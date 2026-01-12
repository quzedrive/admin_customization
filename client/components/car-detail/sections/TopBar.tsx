import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import DateTimePicker from '@/components/date-and-time-picker/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

export default function TopBar() {
    // Default values matching the mockup for visual consistency initially
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2026-01-08 11:11'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs('2026-01-09 23:11'));
    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm w-full py-4 px-[5.4%]">
            <div className="flex items-center justify-center gap-4 md:gap-8 max-w-[1920px] mx-auto">

                {/* Search Criteria Group */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 bg-white">

                    {/* Trip Starts */}
                    <DateTimePicker
                        label="TRIP STARTS"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                    />

                    {/* Trip Ends */}
                    <DateTimePicker
                        label="TRIP ENDS"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                    />

                    {/* Car Type */}
                    <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 min-w-[200px] cursor-pointer relative group">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CAR TYPE</span>
                        <div className="flex items-center justify-between text-sm font-bold text-[#3B82F6]">
                            <span>Hyundai-Vera</span>
                            <ChevronDown size={16} className="text-blue-500" />
                        </div>
                    </div>

                    {/* Modify Search Button */}
                    <button className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-8 py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ml-4">
                        MODIFY SEARCH
                        <ArrowRight size={14} />
                    </button>

                </div>
            </div>
        </div>
    );
}