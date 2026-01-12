'use client';

import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import DateTimePicker from '@/components/date-and-time-picker/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setSearchFormData } from '@/redux/slices/searchSlice';
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';
import Link from 'next/link';

export default function TopBar({ carName }: { carName?: string }) {
    const dispatch = useDispatch();
    const { formData } = useSelector((state: RootState) => state.search);

    // ... (rest of the component)

    {/* Modify Search Button */ }
    <Link
        href={`/${formData.carSlug || '#'}`}
        className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black !text-white px-8 py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ml-4 antialiased"
        style={{ color: '#ffffff' }}
    >
        MODIFY SEARCH
        <ArrowRight size={14} className="text-white" />
    </Link>

    // Dropdown state
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState<'top' | 'bottom'>('bottom');

    // Fetch public cars for dropdown
    const { useGetPublicCars } = useCarQueries();
    const { data: carsData } = useGetPublicCars();
    const cars = Array.isArray(carsData) ? carsData : (carsData as any)?.cars || [];

    // Convert Redux ISO strings to Dayjs or null
    const startDate = formData.tripStart ? dayjs(formData.tripStart) : null;
    const endDate = formData.tripEnd ? dayjs(formData.tripEnd) : null;

    const handleDateChange = (field: 'tripStart' | 'tripEnd', date: Dayjs | null) => {
        const dateStr = date ? date.toISOString() : null;
        dispatch(setSearchFormData({ [field]: dateStr }));
    };

    const handleCarSelect = (car: any) => {
        dispatch(setSearchFormData({
            carId: car._id,
            carName: car.name,
            carSlug: car.slug
        }));
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm w-full py-4 px-[5.4%]">
            <div className="flex items-center justify-center gap-4 md:gap-8 max-w-[1920px] mx-auto">

                {/* Search Criteria Group */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 bg-white">

                    {/* Trip Starts */}
                    <DateTimePicker
                        label="TRIP STARTS"
                        value={startDate}
                        onChange={(date) => handleDateChange('tripStart', date)}
                        placeholder="Select Date"
                    />

                    {/* Trip Ends */}
                    <DateTimePicker
                        label="TRIP ENDS"
                        value={endDate}
                        onChange={(date) => handleDateChange('tripEnd', date)}
                        placeholder="Select Date"
                    />



                    {/* Car Type Dropdown */}
                    <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 w-fit cursor-pointer relative group" ref={dropdownRef}>
                        <div
                            className="flex flex-col gap-1 w-full"
                            onClick={() => {
                                if (!isDropdownOpen && dropdownRef.current) {
                                    const rect = dropdownRef.current.getBoundingClientRect();
                                    const spaceBelow = window.innerHeight - rect.bottom;
                                    const spaceRequired = 200;
                                    setDropdownPosition(spaceBelow < spaceRequired ? 'top' : 'bottom');
                                }
                                setIsDropdownOpen(!isDropdownOpen);
                            }}
                        >
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CAR TYPE</span>
                            <div className="flex items-center justify-between gap-4 text-sm font-bold text-[#3B82F6]">
                                <span className="whitespace-nowrap">{formData.carName || carName || "Select Car"}</span>
                                <ChevronDown size={16} className={`text-blue-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className={`absolute left-0 z-50 min-w-full w-max bg-white rounded-xl shadow-xl border border-gray-100 p-1 overflow-y-auto no-scrollbar ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                                style={{ maxHeight: '15rem' }}
                            >
                                {cars.length > 0 ? (
                                    cars.map((car: any) => (
                                        <div
                                            key={car._id}
                                            className="px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => handleCarSelect(car)}
                                        >
                                            <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">{car.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{car.type} • {car.transmission}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No cars available</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Modify Search Button */}
                    <Link
                        href={`/${formData.carSlug || '#'}`}
                        className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black !text-white px-8 py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ml-4 antialiased"
                        style={{ color: '#ffffff' }}
                    >
                        MODIFY SEARCH
                        <ArrowRight size={14} className="text-white" />
                    </Link>

                </div>
            </div>
        </div>
    );
}