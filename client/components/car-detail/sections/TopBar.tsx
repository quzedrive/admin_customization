'use client';

import React from 'react';
import { ArrowRight, ChevronDown, Loader } from 'lucide-react';
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
    const { useGetPublicCarsInfinite } = useCarQueries();
    const {
        data: carsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetPublicCarsInfinite();
    const cars = carsData?.pages.flatMap((page: any) => page.cars || page) || [];

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

    // Scroll detection for dynamic sticky positioning matching Header
    const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
    const [prevScrollPos, setPrevScrollPos] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            // Header logic: visible if scrolling up or at top (< 10)
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
            setIsHeaderVisible(isVisible);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    // Mobile Expand State
    const [isMobileExpanded, setIsMobileExpanded] = React.useState(false);

    return (
        <div
            className={`sticky z-40 bg-white border-b border-gray-100 shadow-sm w-full py-2 md:py-4 px-[5.4%] transition-all duration-300 ease-in-out ${isHeaderVisible ? 'top-[86px] md:top-[104px]' : 'top-0'}`}
        >
            <div className="max-w-[1920px] mx-auto relative">

                {/* Mobile Collapsed View */}
                <div
                    className={`md:hidden flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl cursor-pointer transition-all ${isMobileExpanded ? 'hidden' : 'flex'}`}
                    onClick={() => setIsMobileExpanded(true)}
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-blue-500 font-bold text-sm">
                            {formData.carName || carName || "Select Car"}
                        </span>
                        <span className="text-[10px] text-gray-600 font-medium">
                            {startDate ? dayjs(startDate).format('DD-MM-YYYY') : 'DD-MM-YYYY'} & {startDate ? dayjs(startDate).format('hh.mm A') : '--.--'}
                            <span className="mx-1 text-gray-300">|</span>
                            {endDate ? dayjs(endDate).format('DD-MM-YYYY') : 'DD-MM-YYYY'} & {endDate ? dayjs(endDate).format('hh.mm A') : '--.--'}
                        </span>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200">
                        <ChevronDown size={16} className="text-blue-500" />
                    </div>
                </div>

                {/* Expanded Search Criteria Group (Mobile Overlay + Desktop Inline) */}
                <div className={`
                    ${isMobileExpanded ? 'absolute top-0 left-0 w-full bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-4 z-50' : 'hidden'}
                    md:flex md:flex-row md:items-center md:justify-center md:gap-6 md:bg-white md:static md:w-full md:p-0 md:shadow-none md:border-none
                `}>

                    {/* Mobile Header (Close Button) */}
                    <div className="flex md:hidden justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-400">MODIFY SEARCH</span>
                        <button onClick={(e) => { e.stopPropagation(); setIsMobileExpanded(false); }} className="p-1 bg-gray-50 rounded-full">
                            <ChevronDown size={18} className="rotate-180 text-gray-500" />
                        </button>
                    </div>

                    {/* Trip Starts */}
                    <div className="w-full md:w-auto">
                        <DateTimePicker
                            label="TRIP STARTS"
                            value={startDate}
                            onChange={(date) => handleDateChange('tripStart', date)}
                            placeholder="Select Date"
                        />
                    </div>

                    {/* Trip Ends */}
                    <div className="w-full md:w-auto">
                        <DateTimePicker
                            label="TRIP ENDS"
                            value={endDate}
                            onChange={(date) => handleDateChange('tripEnd', date)}
                            placeholder="Select Date"
                        />
                    </div>

                    {/* Car Type Dropdown */}
                    <div className="w-full md:w-auto flex flex-col bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 cursor-pointer relative group" ref={dropdownRef}>
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
                            <div className="flex items-center justify-between gap-4 text-sm font-bold text-[#3B82F6] w-full">
                                <span className="whitespace-nowrap flex-1">{formData.carName || carName || "Select Car"}</span>
                                <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className={`absolute left-0 z-50 min-w-full w-full md:w-max bg-white rounded-xl shadow-xl border border-gray-100 p-1 ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                            >
                                <div
                                    className="overflow-y-auto no-scrollbar"
                                    style={{ maxHeight: '15rem' }}
                                    onScroll={(e) => {
                                        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                                        if (scrollHeight - scrollTop <= clientHeight + 50) {
                                            if (hasNextPage && !isFetchingNextPage) {
                                                fetchNextPage();
                                            }
                                        }
                                    }}
                                >
                                    {cars.length > 0 ? (
                                        <>
                                            {cars.map((car: any) => (
                                                <div
                                                    key={car._id}
                                                    className="px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                                    onClick={() => handleCarSelect(car)}
                                                >
                                                    <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">{car.name}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{car.type} • {car.transmission}</p>
                                                </div>
                                            ))}
                                            {isFetchingNextPage && (
                                                <div className="py-2 flex justify-center">
                                                    <Loader className="animate-spin text-gray-500" size={16} />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No cars available</div>
                                    )}
                                </div>

                                {/* Visual Cue for More Content - Fixed at bottom of container */}
                                {cars.length > 3 && (
                                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm w-[90%] flex justify-center py-1 rounded-b-lg pointer-events-none'>
                                        <ChevronDown size={14} className="text-gray-400 animate-bounce" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Modify Search Button */}
                    <Link
                        href={`/${formData.carSlug || '#'}`}
                        className="w-full md:w-auto flex items-center justify-center gap-2 secondary-btn px-6 py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors md:ml-4 antialiased whitespace-nowrap"
                        style={{ color: '#ffffff' }}
                        onClick={() => setIsMobileExpanded(false)}
                    >
                        MODIFY SEARCH
                        <ArrowRight size={14} className="text-white" />
                    </Link>

                </div>
            </div>
        </div>
    );
}